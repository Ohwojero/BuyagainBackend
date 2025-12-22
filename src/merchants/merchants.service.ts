import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string) {
    // If userId is provided, only return merchants owned by that user
    // Otherwise return all merchants (for admin)
    const where = userId ? { users: { some: { id: userId } } } : {};
    return this.prisma.merchant.findMany({
      where,
      include: {
        coupons: {
          select: {
            id: true,
            code: true,
            valueType: true,
            value: true,
            isActive: true,
          },
        },
        redemptions: {
          select: {
            id: true,
            redeemedAt: true,
            discountAmount: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        coupons: {
          select: {
            id: true,
            code: true,
            valueType: true,
            value: true,
            isActive: true,
            createdAt: true,
          },
        },
        redemptions: {
          select: {
            id: true,
            redeemedAt: true,
            discountAmount: true,
          },
        },
        users: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    // Check if user owns this merchant (if userId is provided)
    if (userId && !merchant.users.some(user => user.id === userId)) {
      throw new ForbiddenException('Access denied');
    }

    return merchant;
  }

  async create(createMerchantDto: CreateMerchantDto) {
    return this.prisma.merchant.create({
      data: createMerchantDto,
    });
  }

  async update(id: string, updateMerchantDto: UpdateMerchantDto, userId?: string) {
    // First check if merchant exists and user owns it
    const merchant = await this.findOne(id, userId);

    return this.prisma.merchant.update({
      where: { id },
      data: updateMerchantDto,
    });
  }

  async remove(id: string, userId?: string) {
    // First check if merchant exists and user owns it
    const merchant = await this.findOne(id, userId);

    return this.prisma.merchant.delete({
      where: { id },
    });
  }
}
