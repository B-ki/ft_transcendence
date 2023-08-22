import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSerializer } from './auth.serializer';
import { JwtModule } from '@nestjs/jwt';
import { config } from '@/config';
import { AuthController } from './auth.controller';

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
