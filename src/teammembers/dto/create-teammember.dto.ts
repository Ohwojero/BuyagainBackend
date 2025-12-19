import { IsString, IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateTeammemberDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}
