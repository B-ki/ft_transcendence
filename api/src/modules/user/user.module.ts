import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma';

import { FriendService } from './friend.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, FriendService, PrismaService],
  exports: [FriendService, UserService],
})
export class UserModule {}
