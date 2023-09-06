import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { config } from '@/config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  auth42(@Req() req: Request, @Res() res: Response): void {
    console.log(req);
    console.log(res);
    console.log(config.app42.id);
  }

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
