import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class RedeemCouponDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;
}
