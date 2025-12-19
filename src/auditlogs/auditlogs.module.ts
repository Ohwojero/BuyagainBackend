import { Module } from '@nestjs/common';
import { AuditlogsController } from './auditlogs.controller';
import { AuditlogsService } from './auditlogs.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuditlogsController],
  providers: [AuditlogsService],
})
export class AuditlogsModule {}
