import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FortyTwoProfile } from './auth.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async auth42callback(@Req() req: any): Promise<void> {
    const logger = new Logger();

    // Get the request as parameter
    logger.log(`Req = ${JSON.stringify(req)}`);

    // Handle logic after auth42 succeeded
    this.authService.login(req.user as FortyTwoProfile);
    // We want to create the jwt token
  }

  @Get()
  test() {
    return 'Hello World !';
  }
}
