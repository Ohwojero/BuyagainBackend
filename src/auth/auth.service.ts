import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService, private emailService: EmailService) {}

  async register(registerDto: RegisterDto) {
    const { email, password, businessName, phone, businessType, address } = registerDto;

    // Check if email already exists in merchants
    const existingMerchant = await this.prisma.merchant.findUnique({
      where: { email },
    });
    if (existingMerchant) {
      throw new ConflictException('An account with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create merchant
    const merchant = await this.prisma.merchant.create({
      data: {
        businessName,
        email,
        phone,
        businessType,
        address,
      },
    });

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'MERCHANT',
        merchantId: merchant.id,
        emailVerified: false,
      },
    });

    // Generate verification token
    const verificationToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { expiresIn: '24h' }
    );

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(user.email, verificationToken);
      console.log(`Verification email sent successfully to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails, but log it
      // In production, you might want to queue emails or use a different strategy
    }

    // Return without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      message: 'Registration successful. Please check your email to verify your account.',
      user: userWithoutPassword,
      merchant,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { merchant: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: user.email, sub: user.id, role: user.role, merchantId: user.merchantId };
    const token = this.jwtService.sign(payload);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Return token and user info
    const { password: _, ...userWithoutPassword } = user;
    return {
      message: 'Login successful',
      token,
      user: userWithoutPassword,
      merchant: user.merchant,
    };
  }

  async logout(userId: string) {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    return {
      message: 'Logout successful',
    };
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      if (user.emailVerified) {
        throw new BadRequestException('Email already verified');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { merchant: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user profile without password
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      merchant: user.merchant,
    };
  }
}
