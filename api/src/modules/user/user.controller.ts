import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { FriendService } from './friend.service';
import { UpdateUserDto, UserLoginDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private userService: UserService,
    private friendService: FriendService,
  ) {}

  @Get('/me')
  async getMyUser(@GetUser() user: User) {
    return this.userService.getUnique(user.login);
  }

  @Patch('/me')
  async patchUser(@Body() updateDto: UpdateUserDto, @GetUser() user: User): Promise<User> {
    return this.userService.updateUser(user, updateDto);
  }

  @Post('/friends/add')
  async addFriend(@Body() friendLoginDto: UserLoginDto, @GetUser() user: User) {
    return this.friendService.addFriend(user, friendLoginDto.login);
  }

  @Post('/friends/remove')
  async removeFriend(@Body() friendLoginDto: UserLoginDto, @GetUser() user: User) {
    return this.friendService.removeFriend(user, friendLoginDto.login);
  }

  @Get('/friends/friendlist')
  async getFriendList(@GetUser() user: User): Promise<User[]> {
    return this.friendService.getFriendList(user);
  }

  @Get('/profile/:login')
  async getUserByLogin(@Param('login') login: string) {
    return this.userService.getUnique(login);
  }
}
