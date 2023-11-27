import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @MaxLength(8)
  login: string;
}

export class UpdateUserDto {
  @MaxLength(14)
  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  @MaxLength(30)
  @IsOptional()
  description: string;
}
