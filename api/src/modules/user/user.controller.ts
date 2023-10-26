import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { userDescriptionDto } from './dto/user.interface';
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
    return this.userService.updateDescription(user, description);
  }

  /*
  TO DO : 

  - Create Following :
    - POST :
      - User :
        - addFriend
      - Game :
        - createGame
    - PATCH :
      - User :
        - updateDescription
        - updateUsername
        - updateImage
        - updateBanner
    - GET :
      - User :
        - getFriendList (with isConnected param)
        - getChannelList
        - getGameList (max 10)

  - Create tests for each

  - Create github action for tests

  */
}
