import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateUserDto } from '../auth';

export class UserLoginDto {
  @IsNotEmpty()
  @MaxLength(8)
  login: string;
}

export class UpdateUserDescriptionDto implements Pick<CreateUserDto, 'description'> {
  @IsNotEmpty()
  @MaxLength(256)
  description: string;
}

export class UpdateUserBannerDto implements Pick<CreateUserDto, 'bannerUrl'> {
  @IsNotEmpty()
  bannerUrl: string;
}

export class UpdateUserImageDto implements Pick<CreateUserDto, 'imageUrl'> {
  @IsNotEmpty()
  imageUrl: string;
}

export class UpdateDisplayNameDto implements Pick<CreateUserDto, 'displayName'> {
  @IsNotEmpty()
  @MaxLength(20)
  displayName: string;
}
