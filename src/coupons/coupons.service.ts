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
      const code = await this.generateUniqueCode();

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
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate + 'T23:59:59.999Z') : null,
          title: dto.title,
          description: dto.description,
          terms: dto.terms,
          qrUrl,
          referrerName: dto.referrerName,
          referrerPhone: dto.referrerPhone,
          merchantId,
        },
      });

      // If this is a referral coupon, create a referral record
      if (dto.type === 'REFERRAL' && dto.referrerName && dto.referrerPhone) {
        const referralCode = await this.generateUniqueCode();
        await this.prisma.referral.create({
          data: {
            code: referralCode,
            merchantId,
            referrerName: dto.referrerName,
            referrerPhone: dto.referrerPhone,
            rewardAmount: dto.value, // Use the coupon value as reward amount
          },
        });
      }

      coupons.push(coupon);
    }

    return {
      message: `${dto.quantity} coupon(s) generated successfully`,
      coupons,
    };
  }

  async findAll(merchantId: string) {
    return this.prisma.coupon.findMany({
      where: { merchantId },
    });
  }

  async findOne(id: string, merchantId: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id, merchantId },
    });
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    return coupon;
  }

  async update(id: string, updateData: any, merchantId: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id, merchantId },
    });
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    return this.prisma.coupon.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string, merchantId: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id, merchantId },
    });
    if (!coupon) {
      throw new Error('Coupon not found');
    }
    return this.prisma.coupon.delete({
      where: { id },
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
      const existingCoupon = await this.prisma.coupon.findUnique({
        where: { code },
      });

      if (!existingCoupon) {
        isUnique = true;
      }
    }

    return code;
  }
}
