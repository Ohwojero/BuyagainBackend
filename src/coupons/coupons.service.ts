import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateCouponDto } from './dto/generate-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async generateCoupon(userId: string, dto: GenerateCouponDto) {
    // Get merchant from user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { merchant: true },
    });

    if (!user || !user.merchant) {
      throw new Error('Merchant not found');
    }

    const merchantId = user.merchant.id;
    const coupons: any[] = [];

    for (let i = 0; i < dto.quantity; i++) {
      // Generate unique code
      const code = this.generateUniqueCode();

      // Generate QR code URL (placeholder for now)
      const qrUrl = `https://buyagain.ng/redeem/${code}`;

      // Create coupon in database
      const coupon = await this.prisma.coupon.create({
        data: {
          code,
          type: dto.type,
          value: dto.value,
          valueType: dto.valueType,
          quantity: 1, // Each code is unique
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
          title: dto.title,
          description: dto.description,
          terms: dto.terms,
          qrUrl,
          merchantId,
        },
      });

      coupons.push(coupon);
    }

    return {
      message: `${dto.quantity} coupon(s) generated successfully`,
      coupons,
    };
  }

  private generateUniqueCode(): string {
    // Generate a unique 8-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
