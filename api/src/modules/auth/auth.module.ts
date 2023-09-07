import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { config } from '@/config';

import { UserModule } from '../user';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './auth.serializer';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: `${config.jwt.secret}`,
      signOptions: { expiresIn: config.jwt.expiringTime },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSerializer, JwtStrategy, FortyTwoStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
