import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

import { CreateUserDto } from '../auth';

export class userLoginDto {
  @IsNotEmpty()
  @MaxLength(20)
  login: string;
}

//export class UpdateUserDescriptionDto extends PickType(CreateUserDto, ['description'] as const) {}

export class UpdateUserDescriptionDto implements Pick<CreateUserDto, 'description'> {
  description: string;
}

//export class UpdateUserBannerDto extends PickType(CreateUserDto, ['bannerUrl'] as const) {}

//export class UpdateUserImageDto extends PickType(CreateUserDto, ['imageUrl'] as const) {}

//export class UpdateUserUsernameDto extends PickType(CreateUserDto, ['displayName'] as const) {}

export class UpdateUserBannerDto implements Pick<CreateUserDto, 'bannerUrl'> {
  bannerUrl: string;
}

export class UpdateUserImageDto implements Pick<CreateUserDto, 'imageUrl'> {
  imageUrl: string;
}

export class UpdateUserUsernameDto implements Pick<CreateUserDto, 'displayName'> {
  displayName: string;
}
