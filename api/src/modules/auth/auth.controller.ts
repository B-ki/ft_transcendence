import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from "@prisma/client";

import { AuthService } from './auth.service';
import { GetUser } from './decorators';
import { FortyTwoAuthGuard, JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  auth42(): void {}

  @Get('42/callback')
  @UseGuards(FortyTwoAuthGuard)
  async auth42callback(@Req() req: any): Promise<{ token: string }> {
    return {
      token: await this.authService.login(req.user),
    };
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  async test(@GetUser() user: User) {
    //const name = await this.authService.test(user);
    return `Hello World ! I am ${user.firstName}`;
  }
}
