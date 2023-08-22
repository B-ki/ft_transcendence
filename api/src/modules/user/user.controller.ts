import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
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
}
