import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getAnalytics(merchantId: string) {
    const totalCoupons = await this.prisma.coupon.count({
      where: { merchantId },
    });

    const totalRedemptions = await this.prisma.redemption.count({
      where: { merchantId },
    });

    const totalReferrals = await this.prisma.referral.count({
      where: { merchantId },
    });

    const totalRevenue = await this.prisma.redemption.aggregate({
      where: { merchantId },
      _sum: { discountAmount: true },
    });

    return {
      totalCoupons,
      totalRedemptions,
      totalReferrals,
      totalRevenue: totalRevenue._sum.discountAmount || 0,
    };
  }
}
