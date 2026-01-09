import { IsNotEmpty, IsString } from 'class-validator';

export class RedeemReferralDto {
  @IsNotEmpty()
  @IsString()
  referredName: string;

  @IsNotEmpty()
  @IsString()
  referredPhone: string;
}
