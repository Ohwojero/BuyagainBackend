import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateReferralDto {
  @IsNotEmpty()
  @IsString()
  referrerName: string;

  @IsNotEmpty()
  @IsString()
  referrerPhone: string;

  @IsOptional()
  @IsString()
  referredName?: string;

  @IsOptional()
  @IsString()
  referredPhone?: string;

  @IsOptional()
  @IsNumber()
  rewardAmount?: number;
}
