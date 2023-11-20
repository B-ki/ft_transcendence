import { UserStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export interface JwtPayload {
  login: string;
  isTwoFaEnabled: boolean;
  isTwoFaAuthenticated: boolean;
}

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(8)
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  displayName: string;

  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsString()
  imagePath: string;

  @IsString()
  bannerPath: string;

  @IsNotEmpty()
  @IsUrl()
  intraImageURL: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  description: string;
}

export class twoFACodeDto {
  @IsNotEmpty()
  twoFACode: string;
}

export class loginTwoFaDto {
  @IsNotEmpty()
  @IsString()
  twoFACode: string;
}
