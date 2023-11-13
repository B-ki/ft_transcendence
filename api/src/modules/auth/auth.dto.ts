import { UserStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class JwtPayload {
  login: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  login: string;

  @IsEmail()
  email: string;

  imageUrl: string;

  displayName: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserStatus)
  status: UserStatus;

  bannerUrl: string;

  description: string;
}
