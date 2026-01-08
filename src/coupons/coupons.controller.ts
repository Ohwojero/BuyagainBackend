import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { GenerateCouponDto } from './dto/generate-coupon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.couponsService.findAll(req.user.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.couponsService.findOne(id, req.user.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generateCoupon(
    @Body() dto: GenerateCouponDto,
    @Req() req: any,
  ) {
    return this.couponsService.generateCoupon(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: any, @Req() req: any) {
    return this.couponsService.update(id, updateData, req.user.merchantId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.couponsService.remove(id, req.user.merchantId);
  }
}
