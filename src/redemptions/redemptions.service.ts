import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedeemCouponDto } from './dto/redeem-coupon.dto';

@Injectable()
export class RedemptionsService {
  constructor(private prisma: PrismaService) {}

  async redeemCoupon(merchantId: string, redeemDto: RedeemCouponDto) {
    const { code, customerName, customerPhone, location, discountAmount } = redeemDto;

    // Find the coupon
    const coupon = await this.prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (coupon.merchantId !== merchantId) {
      throw new BadRequestException('Coupon does not belong to this merchant');
    }

    if (coupon.status !== 'ACTIVE') {
      throw new BadRequestException('Coupon is not active');
    }

    if (coupon.usedCount >= coupon.quantity) {
      throw new BadRequestException('Coupon has reached its usage limit');
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      throw new BadRequestException('Coupon has expired');
    }

    // Create redemption record
    const redemption = await this.prisma.redemption.create({
      data: {
        merchantId,
        couponId: coupon.id,
        customerName,
        customerPhone,
        location,
        discountAmount,
        status: 'COMPLETED',
      },
    });

    // Update coupon used count
    await this.prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: { increment: 1 } },
    });

    // If this is a referral coupon, create a referral record
    if (coupon.type === 'REFERRAL' && coupon.referrerName && coupon.referrerPhone) {
      const referralCode = await this.generateUniqueCode();
      await this.prisma.referral.create({
        data: {
          code: referralCode,
          merchantId,
          referrerName: coupon.referrerName,
          referrerPhone: coupon.referrerPhone,
          referredName: customerName,
          referredPhone: customerPhone,
          rewardAmount: coupon.value, // Use the coupon value as reward amount
        },
      });
    }

    return {
      message: 'Coupon redeemed successfully',
      redemption,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        valueType: coupon.valueType,
      },
    };
  }

  async getRedemptions(merchantId: string) {
    return this.prisma.redemption.findMany({
      where: { merchantId },
      include: {
        coupon: {
          select: {
            code: true,
            type: true,
            value: true,
            valueType: true,
          },
        },
      },
      orderBy: { redeemedAt: 'desc' },
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
