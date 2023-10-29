import { Body, Controller, Get, Logger, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';
import {
  UpdateUserBannerDto,
  UpdateUserDescriptionDto,
  UpdateUserImageDto,
  UpdateUserUsernameDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:login')
  async getUserByLogin(@Param('login') login: string) {
    return this.userService.getUnique(login);
  }

  @Patch('/:login/description')
  async patchDescription(
    @Body() descriptionDto: UpdateUserDescriptionDto,
    @GetUser() user: User,
  ): Promise<User> {
    const { description } = descriptionDto;
    const logger = new Logger();
    logger.debug('description = ', descriptionDto);
    return this.userService.updateDescription(user, description);
  }

  @Patch('/:login/banner')
  async patchBanner(@Body() bannerDto: UpdateUserBannerDto, @GetUser() user: User): Promise<User> {
    const { bannerUrl } = bannerDto;
    return this.userService.updateBanner(user, bannerUrl);
  }

  @Patch('/:login/image')
  async patchImage(@Body() imageDto: UpdateUserImageDto, @GetUser() user: User): Promise<User> {
    const { imageUrl } = imageDto;
    return this.userService.updateImage(user, imageUrl);
  }

  @Patch('/:login/username')
  async patchUsername(
    @Body() usernameDto: UpdateUserUsernameDto,
    @GetUser() user: User,
  ): Promise<User> {
    const { displayName } = usernameDto;
    return this.userService.updateUsername(user, displayName);
  }
  /*
  TO DO : 

  - Create Following :
    - POST :
      - User :
        - addFriend
      - Game :
        - createGame
    - GET :
      - User :
        - getFriendList (with isConnected param)
        - getChannelList
        - getGameList (max 10)

  - Create tests for each

  - Create github action for tests

  */
}
