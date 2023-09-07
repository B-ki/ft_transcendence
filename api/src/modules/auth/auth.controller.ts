import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  auth42(): void {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async auth42callback(@Req() req: any): Promise<{ token: string }> {
    console.log('user from 42.strategy.validate: ', req.user);
    return { token: await this.authService.login(req.user) };
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  test() {
    return 'Hello World !';
  }
}
