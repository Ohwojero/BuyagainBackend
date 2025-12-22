import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantsService.create(createMerchantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    // If user is not admin, only return their own merchants
    const userId = req.user.role !== 'ADMIN' ? req.user.userId : undefined;
    return this.merchantsService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    // If user is not admin, check ownership
    const userId = req.user.role !== 'ADMIN' ? req.user.userId : undefined;
    return this.merchantsService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto, @Request() req) {
    // If user is not admin, check ownership
    const userId = req.user.role !== 'ADMIN' ? req.user.userId : undefined;
    return this.merchantsService.update(id, updateMerchantDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    // If user is not admin, check ownership
    const userId = req.user.role !== 'ADMIN' ? req.user.userId : undefined;
    return this.merchantsService.remove(id, userId);
  }
}
