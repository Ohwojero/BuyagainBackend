import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CouponType, DiscountType } from '@prisma/client';

export class GenerateCouponDto {
  @IsEnum(CouponType)
  @IsNotEmpty()
  type: CouponType;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  value: number;

  @IsEnum(DiscountType)
  @IsNotEmpty()
  valueType: DiscountType;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsString()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  terms?: string;
}
