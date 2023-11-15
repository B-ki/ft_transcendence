import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { config } from '@/config';
import { multerOptions } from '@/utils/multerOptions';

import { GetUser } from '../auth/decorators';
import { JwtTwoFaAuthGuard } from '../auth/guards';
import { FriendService } from './friend.service';
import { UpdateUserDto, UserLoginDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtTwoFaAuthGuard)
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

  @Post('/me/image')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async updateImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: config.app.maxFileSize }),
          new FileTypeValidator({ fileType: '(png|jpeg|jpg|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return await this.userService.setProfilePicturePath(file.path, user);
  }

  @Post('/me/banner')
  @UseInterceptors(FileInterceptor('banner', multerOptions))
  async updateBanner(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: config.app.maxFileSize }),
          new FileTypeValidator({ fileType: '(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    return await this.userService.setBannerPath(file.path, user);
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
