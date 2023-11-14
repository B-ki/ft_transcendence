import { UserStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class JwtPayload {
  login: string;
  isTwoFaEnabled: boolean;
  isTwoFaAuthenticated: boolean;
}

export class CreateUserDto {
  @IsNotEmpty()
  login: string;

  @IsEmail()
  email: string;

  imagePath: string;

  displayName: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  bannerPath: string;

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

  @IsNotEmpty()
  @IsString()
  login: string;
}
