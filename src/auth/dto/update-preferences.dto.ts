import { IsBoolean } from 'class-validator';

export class UpdatePreferencesDto {
  @IsBoolean()
  emailNotifications: boolean;

  @IsBoolean()
  redemptionAlerts: boolean;

  @IsBoolean()
  usageWarnings: boolean;

  @IsBoolean()
  whatsappNotifications: boolean;
}
