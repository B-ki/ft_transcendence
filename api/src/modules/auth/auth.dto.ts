import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JwtPayload {
  login: string;
}

export class JwtPayload2FA {
  login: string;
<<<<<<< HEAD
=======
  isTwoFAEnabled: boolean;
>>>>>>> 475bf61 (Starting 2FA)
  isTwoFactorAuthenticated: boolean;
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
