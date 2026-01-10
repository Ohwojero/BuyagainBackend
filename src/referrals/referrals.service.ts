import { Injectable } from '@nestjs/common';
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
    return this.prisma.referral.findUnique({
      where: { code },
    });
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

      // Check if code already exists
      const existingReferral = await this.prisma.referral.findUnique({
        where: { code },
      });

      if (!existingReferral) {
        isUnique = true;
      }
    }

    return code;
  }
}
