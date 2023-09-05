import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async auth42callback(@Param('code') code: string): Promise<void> {
    console.log(code);
  }

  @Get()
  test() {
    return 'Hello World !';
  }
}
