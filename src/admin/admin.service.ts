import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OverviewDto } from './dto/overview.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getOverview(): Promise<OverviewDto> {
    // Get total merchants
    const totalMerchants = await this.prisma.merchant.count();

    // Get active merchants (those with isActive = true)
    const activeMerchants = await this.prisma.merchant.count({
      where: { isActive: true },
    });

    // Get total revenue from subscriptions (assuming subscriptions have a price field)
    // For now, we'll use a placeholder since the subscription model might not have price
    const totalRevenue = 0; // TODO: Calculate from subscriptions

    // Get total redemptions
    const totalRedemptions = await this.prisma.redemption.count();

    // Get recent merchants (last 5)
    const recentMerchants = await this.prisma.merchant.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        businessName: true,
        tier: true,
        createdAt: true,
      },
    });

    // Get plan distribution
    const planDistribution = await this.prisma.merchant.groupBy({
      by: ['tier'],
      _count: {
        tier: true,
      },
    });

    const totalMerchantsCount = totalMerchants;
    const planStats = planDistribution.map(item => ({
      plan: item.tier,
      count: item._count.tier,
      percentage: Math.round((item._count.tier / totalMerchantsCount) * 100),
    }));

    return {
      totalMerchants,
      activeMerchants,
      totalRevenue,
      totalRedemptions,
      recentMerchants: recentMerchants.map(m => ({
        id: m.id,
        name: m.businessName,
        plan: m.tier,
        joined: m.createdAt.toISOString().split('T')[0],
      })),
      planDistribution: planStats,
    };
  }
}
