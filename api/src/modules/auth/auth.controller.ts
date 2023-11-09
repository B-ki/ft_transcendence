import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from '../user';
import { loginTwoFaDto, twoFACodeDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { FortyTwoAuthGuard, Jwt2faAuthGuard, JwtAuthGuard } from './guards';

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
      return { require2FA: true, login: login };
    }
  }

  @Post('42/2fa')
  //@UseGuards(FortyTwoAuthGuard)
  async connectWith2FA(@Body() body: loginTwoFaDto) {
    console.log('[connectWith2FA]', body.twoFACode, body.login);
    const token = this.authService.loginWithTwoFa(body.twoFACode, body.login);
    return { token };
  }

  @Get('2fa/qrcode')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFA(@GetUser() user: User) {
    console.log('[2fa/qrcode] user.twoFactorAuthSecret :', user.twoFactorAuthSecret);
    if (user.twoFactorAuthSecret && user.isTwoFaEnabled == false) {
      const QrCodeUrl = await this.authService.getQrCodeDataURL(user);
      //console.log('[/2fa/qrcode] QrCode: ', QrCodeUrl);
      return { QrCodeUrl: QrCodeUrl };
    } else if (user.isTwoFaEnabled == true) {
      return { QrCodeActivated: true };
    } else {
      const QrCodeUrl = await this.authService.turnOnTwoFA(user);
      return { QrCodeUrl: QrCodeUrl };
    }
  }

  @Post('2fa/authenticate')
  @UseGuards(JwtAuthGuard)
  async enableTwoFa(@Body() body: twoFACodeDto, @GetUser() user: User) {
    const isCodeValid = this.authService.isTwoFactorAuthCodeValid(body.twoFACode, user);
    console.log('[/2fa/authenticate] isColeValid :', isCodeValid);
    if (!isCodeValid) throw new UnauthorizedException('Wrong 2FA code');
    this.userService.enableTwoFa(user);
  }

  @Post('2fa/deactivate')
  @UseGuards(JwtAuthGuard)
  async disableTwoFa(@Body() body: twoFACodeDto, @GetUser() user: User) {
    console.log('[/2fa/deactivate] code:', body.twoFACode);
    //const isCodeValid = this.authService.isTwoFactorAuthCodeValid(body.twoFACode, user);
    //console.log('[/2fa/deactivate] isColeValid :', isCodeValid);
    //if (!isCodeValid) throw new UnauthorizedException('Wrong 2FA code');
    this.userService.disableTwoFa(user);
  }
}
