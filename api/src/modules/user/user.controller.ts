import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { FriendService } from './friend.service';
import {
  UpdateDisplayNameDto,
  UpdateUserBannerDto,
  UpdateUserDescriptionDto,
  UpdateUserImageDto,
  UserLoginDto,
} from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private userService: UserService,
    private friendService: FriendService,
  ) {}

  @Get('/:login')
  async getUserByLogin(@Param('login') login: string) {
    return this.userService.getUnique(login);
  }

  @Patch('/:login/description')
  async patchDescription(
    @Body() descriptionDto: UpdateUserDescriptionDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.userService.updateDescription(user, descriptionDto.description);
  }

  @Patch('/:login/banner')
  async patchBanner(@Body() bannerDto: UpdateUserBannerDto, @GetUser() user: User): Promise<User> {
    return this.userService.updateBanner(user, bannerDto.bannerUrl);
  }

  @Patch('/:login/image')
  async patchImage(@Body() imageDto: UpdateUserImageDto, @GetUser() user: User): Promise<User> {
    return this.userService.updateImage(user, imageDto.imageUrl);
  }

  @Patch('/:login/displayname')
  async patchDisplayname(
    @Body() displaynameDto: UpdateDisplayNameDto,
    @GetUser() user: User,
  ): Promise<User> {
    return this.userService.updateDisplayName(user, displaynameDto.displayName);
  }

  @Post('/addfriend')
  async addFriend(@Body() friendLoginDto: UserLoginDto, @GetUser() user: User) {
    return this.friendService.addFriend(user, friendLoginDto.login);
  }

  @Post('/removefriend')
  async removeFriend(@Body() friendLoginDto: UserLoginDto, @GetUser() user: User) {
    return this.friendService.removeFriend(user, friendLoginDto.login);
  }

  @Get('/friendlist')
  async getFriendList(@GetUser() user: User): Promise<User[]> {
    return this.friendService.getFriendList(user);
  }

  /*
  TO DO : 

  - Create ladder when winning or losing games

  - Create tests for each

  - Create github action for tests

  */
}
