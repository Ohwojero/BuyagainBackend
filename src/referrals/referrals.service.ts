import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReferralDto } from './dto/create-referral.dto';

@Injectable()
export class ReferralsService {
  constructor(private prisma: PrismaService) {}

  async createReferral(merchantId: string, createReferralDto: CreateReferralDto) {
    const { referrerName, referrerPhone, referredName, referredPhone, rewardAmount } = createReferralDto;

    const referral = await this.prisma.referral.create({
      data: {
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
}
