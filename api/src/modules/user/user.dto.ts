import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @MaxLength(8)
  login: string;
}

export class UpdateUserDto {
  @MaxLength(20)
  @IsString()
  displayName: string;

  @IsString()
  @MaxLength(30)
  description: string;

  @IsString()
  bannerUrl: string;

  @IsString()
  imageUrl: string;
}
