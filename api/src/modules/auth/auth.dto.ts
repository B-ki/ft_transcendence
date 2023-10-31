import { IsEmail, IsNotEmpty } from 'class-validator';

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

  isConnected: boolean;

  bannerUrl: string;

  description: string;
}
