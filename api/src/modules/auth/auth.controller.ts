import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { DummyUserOne, DummyUserTwo } from './auth.dto';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  auth42(): void {}

  @Get('42/callback')
  @UseGuards(FortyTwoAuthGuard)
  async auth42callback(@Req() req: any): Promise<{ token: string; login: string }> {
    return {
      token: await this.authService.login(req.user),
      login: req.user.login,
    };
  }

  @Get('dummy/1')
  async createDummyUserOne(): Promise<{ token: string; login: string }> {
    return {
      token: await this.authService.login(DummyUserOne),
      login: DummyUserOne.login,
    };
  }

  @Get('dummy/2')
  async createDummyUserTwo(): Promise<{ token: string; login: string }> {
    return {
      token: await this.authService.login(DummyUserTwo),
      login: DummyUserTwo.login,
    };
  }
}
