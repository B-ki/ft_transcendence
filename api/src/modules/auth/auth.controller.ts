import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from '../user';
import { twoFACodeDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { FortyTwoAuthGuard, JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

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

  @Post('2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFA(@Body() body: twoFACodeDto, @GetUser() user: User) {
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(body.twoFACode, user);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong 2FA code');
    } else await this.userService.enableTwoFa(user);
  }

  @Post('2fa/authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Body() body: twoFACodeDto, @GetUser() user: User) {
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(body.twoFACode, user);
    if (!isCodeValid) throw new UnauthorizedException('Wrong 2FA code');
    else return this.authService.loginWithTwoFA(user);
  }
}
