import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { config } from '@/config';

import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: config.jwt.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSerializer],
  exports: [AuthService],
})
export class AuthModule {}
