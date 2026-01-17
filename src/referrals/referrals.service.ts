import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReferralDto } from './dto/create-referral.dto';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async createReferral(merchantId: string, createReferralDto: CreateReferralDto) {
    const { referrerName, referrerPhone, referredName, referredPhone, rewardAmount } = createReferralDto;

    // Generate unique code
    const code = await this.generateUniqueCode();

    const referral = await this.prisma.referral.create({
      data: {
        code,
        merchantId,
        referrerName,
        referrerPhone,
        referredName,
        referredPhone,
        rewardAmount,
      },
    });

    return {
      message: 'Referral created successfully',
      referral,
    };
  }

  async getReferrals(merchantId: string) {
    return this.prisma.referral.findMany({
      where: { merchantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReferralByCode(code: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { code },
    });

    if (!referral) {
      throw new NotFoundException('Referral code not found');
    }

    return referral;
  }

  async redeemReferral(code: string, referredName: string, referredPhone: string) {
    // Find the referral by code
    const referral = await this.prisma.referral.findUnique({
      where: { code },
    });

    if (!referral) {
      throw new Error('Referral code not found');
    }

    if (referral.isCompleted) {
      throw new Error('Referral has already been completed');
    }

    // Update the referral with referred person details and mark as completed
    const updatedReferral = await this.prisma.referral.update({
      where: { code },
      data: {
        referredName,
        referredPhone,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    return {
      message: 'Referral redeemed successfully',
      referral: updatedReferral,
    };
  }

  private async generateUniqueCode(): Promise<string> {
    // Generate a unique 8-character alphanumeric code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    let isUnique = false;

    while (!isUnique) {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Check if code already exists in referrals or coupons
      const existingReferral = await this.prisma.referral.findUnique({
        where: { code },
      });

      const existingCoupon = await this.prisma.coupon.findUnique({
        where: { code },
      });

      if (!existingReferral && !existingCoupon) {
        isUnique = true;
      }
    }

    return code;
  }
}
