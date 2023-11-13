import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from '../user';
import { loginTwoFaDto, twoFACodeDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { FortyTwoAuthGuard, JwtTwoFaAuthGuard, JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Get('42/login')
  @UseGuards(FortyTwoAuthGuard)
  async auth42callback(
    @Req() req: any,
  ): Promise<{ token: string; login: string } | { require2FA: boolean }> {
    const { token, isTwoFaEnabled } = await this.authService.login(req.user);
    const login = req.user.login;
    if (isTwoFaEnabled == false) {
      return { token, require2FA: false, login };
    } else {
      return { token, require2FA: true, login };
    }
  }

  @Post('2fa/login')
  @UseGuards(JwtAuthGuard)
  async connectWith2FA(@Body() body: loginTwoFaDto) {
    const token = await this.authService.loginWithTwoFa(body.twoFACode, body.login);
    return { token };
  }

  @Get('2fa/qrcode')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFA(@GetUser() user: User) {
    if (user.twoFactorAuthSecret && user.isTwoFaEnabled == false) {
      const QrCodeUrl = await this.authService.getQrCodeDataURL(user);
      return { QrCodeUrl: QrCodeUrl };
    } else if (user.isTwoFaEnabled == true) {
      return { QrCodeActivated: true };
    } else {
      const QrCodeUrl = await this.authService.turnOnTwoFA(user);
      return { QrCodeUrl: QrCodeUrl };
    }
  }

  @Post('2fa/activate')
  @UseGuards(JwtAuthGuard)
  async enableTwoFa(@Body() body: twoFACodeDto, @GetUser() user: User) {
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(body.twoFACode, user);
    if (!isCodeValid) throw new UnauthorizedException('Wrong 2FA code');
    this.userService.enableTwoFa(user);
  }

  @Post('2fa/deactivate')
  @UseGuards(JwtAuthGuard)
  async disableTwoFa(@Body() body: twoFACodeDto, @GetUser() user: User) {
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(body.twoFACode, user);
    if (!isCodeValid) throw new UnauthorizedException('Wrong 2FA code');
    this.userService.disableTwoFa(user);
  }
}
