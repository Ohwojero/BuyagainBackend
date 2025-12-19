import { Controller, Get, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AuditlogsService } from './auditlogs.service';
import { QueryAuditlogDto } from './dto/query-auditlog.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('auditlogs')
export class AuditlogsController {
  constructor(private readonly auditlogsService: AuditlogsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req, @Query() query: QueryAuditlogDto) {
    return this.auditlogsService.findAll(req.user.merchantId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.auditlogsService.findOne(id, req.user.merchantId);
  }
}
