import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { config } from '@/config';

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
  async auth42callback(@Req() req: any): Promise<string> {
    const token = await this.authService.login(req.user);

    const HTML = `
    <html>
      <script>
        window.localStorage.setItem('token', '${token}');
        window.location.href = 'http://' + window.location.hostname + ':${config.app.frontPort}/';
      </script>
    </html>
    `;

    return HTML;
  }

  @Get('test')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async test(@GetUser() user: User) {
    return `Hello World ! I am ${user.firstName}`;
  }
}
