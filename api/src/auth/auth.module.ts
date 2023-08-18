import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSerializer } from './auth.serializer';

@Module({
  imports: [],
  providers: [AuthService, AuthSerializer],
  exports: [AuthService],
})
export class AuthModule {}
