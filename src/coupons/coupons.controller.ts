import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { GenerateCouponDto } from './dto/generate-coupon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generateCoupon(
    @Body() dto: GenerateCouponDto,
    @Req() req: any,
  ) {
    return this.couponsService.generateCoupon(req.user.id, dto);
  }
}
