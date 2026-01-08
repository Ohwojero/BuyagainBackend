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

    // Get returning customers (customers with more than 1 redemption)
    const returningCustomers = await this.prisma.customer.count({
      where: {
        merchantId,
        totalRedemptions: {
          gt: 1,
        },
      },
    });

    // Get top customers by redemption count
    const topCustomers = await this.prisma.customer.findMany({
      where: { merchantId },
      select: {
        id: true,
        name: true,
        totalRedemptions: true,
      },
      orderBy: {
        totalRedemptions: 'desc',
      },
      take: 5,
    });

    // Get coupon performance by type
    const couponPerformance = await this.prisma.coupon.groupBy({
      by: ['valueType'],
      where: { merchantId },
      _count: {
        id: true,
      },
      _sum: {
        usedCount: true,
      },
    });

    return {
      totalCoupons,
      totalRedemptions,
      totalReferrals,
      totalRevenue: totalRevenue._sum.discountAmount || 0,
      returningCustomers,
      topCustomers: topCustomers.map(customer => ({
        id: customer.id,
        name: customer.name,
        visits: customer.totalRedemptions,
      })),
      couponPerformance: couponPerformance.map(coupon => ({
        type: coupon.valueType,
        generated: coupon._count.id,
        redeemed: coupon._sum.usedCount || 0,
      })),
    };
  }
}
