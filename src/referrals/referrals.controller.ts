import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ReferralsService } from './referrals.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createReferral(@Request() req, @Body() createReferralDto: CreateReferralDto) {
    return this.referralsService.createReferral(req.user.merchantId, createReferralDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getReferrals(@Request() req) {
    return this.referralsService.getReferrals(req.user.merchantId);
  }
}
