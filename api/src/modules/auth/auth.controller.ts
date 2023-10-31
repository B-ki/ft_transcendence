import { Controller, Get, Req, UseGuards } from '@nestjs/common';

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
}
