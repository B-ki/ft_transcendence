import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateUserDto } from '../auth';

export class userLoginDto {
  @IsNotEmpty()
  @MaxLength(20)
  login: string;
}

export class UpdateUserDescriptionDto implements Pick<CreateUserDto, 'description'> {
  @IsNotEmpty()
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

export class UpdateUserUsernameDto implements Pick<CreateUserDto, 'displayName'> {
  @IsNotEmpty()
  displayName: string;
}
