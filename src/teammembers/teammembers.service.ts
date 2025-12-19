import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeammemberDto } from './dto/create-teammember.dto';
import { UpdateTeammemberDto } from './dto/update-teammember.dto';

@Injectable()
export class TeammembersService {
  constructor(private prisma: PrismaService) {}

  async create(merchantId: string, createTeammemberDto: CreateTeammemberDto) {
    return this.prisma.teamMember.create({
      data: {
        ...createTeammemberDto,
        merchantId,
      },
    });
  }

  async findAll(merchantId: string) {
    return this.prisma.teamMember.findMany({
      where: { merchantId },
    });
  }

  async findOne(id: string, merchantId: string) {
    return this.prisma.teamMember.findFirst({
      where: { id, merchantId },
    });
  }

  async update(id: string, merchantId: string, updateTeammemberDto: UpdateTeammemberDto) {
    return this.prisma.teamMember.updateMany({
      where: { id, merchantId },
      data: updateTeammemberDto,
    });
  }

  async remove(id: string, merchantId: string) {
    return this.prisma.teamMember.deleteMany({
      where: { id, merchantId },
    });
  }
}
