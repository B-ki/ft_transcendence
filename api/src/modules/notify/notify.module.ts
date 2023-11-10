import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { FriendService, UserService } from '../user';
import { NotifyService } from './notify.service';

@Module({
  controllers: [],
  providers: [NotifyService, JwtService, UserService, FriendService],
})
export class NotifyModule {}
