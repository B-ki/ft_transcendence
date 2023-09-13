import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/all')
  async getAllUsers() {
    return this.userService.getAll();
  }

  @Get('/:id')
  async getUserByLogin(@Param('id') id: string) {
    return this.userService.getUnique(id);
  }
}
