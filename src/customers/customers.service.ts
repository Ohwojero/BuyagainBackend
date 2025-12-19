import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(merchantId: string, createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        ...createCustomerDto,
        merchantId,
      },
    });
  }

  async findAll(merchantId: string) {
    return this.prisma.customer.findMany({
      where: { merchantId },
    });
  }

  async findOne(id: string, merchantId: string) {
    return this.prisma.customer.findFirst({
      where: { id, merchantId },
    });
  }

  async update(id: string, merchantId: string, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.customer.updateMany({
      where: { id, merchantId },
      data: updateCustomerDto,
    });
  }

  async remove(id: string, merchantId: string) {
    return this.prisma.customer.deleteMany({
      where: { id, merchantId },
    });
  }
}
