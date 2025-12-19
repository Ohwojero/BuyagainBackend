import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { RedemptionsService } from './redemptions.service';
import { RedeemCouponDto } from './dto/redeem-coupon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('redemptions')
export class RedemptionsController {
  constructor(private readonly redemptionsService: RedemptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('redeem')
  async redeemCoupon(@Request() req, @Body() redeemDto: RedeemCouponDto) {
    return this.redemptionsService.redeemCoupon(req.user.merchantId, redeemDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getRedemptions(@Request() req) {
    return this.redemptionsService.getRedemptions(req.user.merchantId);
  }
}
