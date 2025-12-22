import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class CreateMerchantDto {
  @IsString()
  businessName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  businessType?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsEnum(SubscriptionPlan)
  tier?: SubscriptionPlan;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
