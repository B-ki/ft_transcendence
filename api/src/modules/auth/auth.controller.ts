import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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
  async auth42callback(
    @Req() req: any,
  ): Promise<{ token: string; login: string } | { require2FA: boolean }> {
    const { token, isTwoFaEnabled } = await this.authService.login(req.user);
    const login = req.user.login;
    if (isTwoFaEnabled == false) {
      return { token, login };
    } else {
      return { require2FA: true };
    }
  }

  @Post('42/2fa')
  @UseGuards(FortyTwoAuthGuard)
  async connectWith2FA(@Body() body: twoFACodeDto, @Req() req: any) {
    return this.authService.loginWithTwoFa(body.twoFACode, req.user);
  }

  @Get('2fa/qrcode')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFA(@GetUser() user: User) {
    const QrCodeUrl = await this.authService.turnOnTwoFA(user);
    return { QrCodeUrl: QrCodeUrl };
  }

  @Post('2fa/authenticate')
  @UseGuards(JwtAuthGuard)
  async enableTwoFa(@Body() body: twoFACodeDto, @GetUser() user: User) {
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(body.twoFACode, user);
    console.log(isCodeValid);
    if (!isCodeValid) throw new UnauthorizedException('Wrong 2FA code');
    this.userService.enableTwoFa(user);
  }
}
