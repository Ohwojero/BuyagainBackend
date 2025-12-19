import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryAuditlogDto } from './dto/query-auditlog.dto';

@Injectable()
export class AuditlogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(merchantId: string, query?: QueryAuditlogDto) {
    const where: any = { merchantId };

    if (query) {
      if (query.entityType) where.entityType = query.entityType;
      if (query.entityId) where.entityId = query.entityId;
      if (query.action) where.action = query.action;
      if (query.userId) where.userId = query.userId;
      if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) where.createdAt.gte = new Date(query.startDate);
        if (query.endDate) where.createdAt.lte = new Date(query.endDate);
      }
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, merchantId: string) {
    return this.prisma.auditLog.findFirst({
      where: { id, merchantId },
    });
  }
}
