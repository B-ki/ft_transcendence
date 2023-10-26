import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';
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

  /*
  TO DO : 

  - Create Following :
    - POST :
      - User :
        - addFriend
        - updateDescription
        - updateUsername
        - updateImage
        - updateBanner
      - Game :
        - createGame
        - updateGameWinner
    - GET :
      - User :
        - getFriendList (with isConnected param)
        - getChannelList
        - getGameList (max 10)

  - Create tests for each

  - Create github action for tests

  */
}
