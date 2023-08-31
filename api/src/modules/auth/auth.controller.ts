import { Controller } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor() {
    @Get('42')
    auth42()

    @Get('42/callback')
    async auth42callback() { // Get the request as parameter
      // Handle logic after auth42 succeeded
      // We want to create the jwt token
    }

  }
}
