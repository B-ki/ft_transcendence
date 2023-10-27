import { Body, Controller, Get, Logger, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';
import {
  userBannerDto,
  userDescriptionDto,
  userImageDto,
  userUsernameDto,
} from './dto/user.interface';
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
    @Body() descriptionDto: userDescriptionDto,
    @GetUser() user: User,
  ): Promise<User> {
    const { description } = descriptionDto;
    const logger = new Logger();
    logger.debug('description = ', descriptionDto);
    return this.userService.updateDescription(user, description);
  }

  @Patch('/:login/banner')
  async patchBanner(@Body() bannerDto: userBannerDto, @GetUser() user: User): Promise<User> {
    const { banner } = bannerDto;
    const logger = new Logger();
    logger.debug('bannerDto: ', bannerDto);
    logger.debug('bannerUrl: ', banner);
    return this.userService.updateBanner(user, banner);
  }

  @Patch('/:login/image')
  async patchImage(@Body() imageDto: userImageDto, @GetUser() user: User): Promise<User> {
    const { image } = imageDto;
    return this.userService.updateImage(user, image);
  }

  @Patch('/:login/username')
  async patchUsername(@Body() usernameDto: userUsernameDto, @GetUser() user: User): Promise<User> {
    const { username } = usernameDto;
    return this.userService.updateUsername(user, username);
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
