import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUser() {
    return {
      id: 1,
      login: 'apigeon',
      email: 'apigeon@42.fr',
    };
  }

  @Get('/all')
  async getAllUsers() {
    return this.userService.getAll();
  }

  @Get('/:id')
  async getUserByLogin(@Param('id') id: string) {
    return this.userService.getUnique(id);
  }
}
