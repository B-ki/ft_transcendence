import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma';

import { UserService } from '../user';
import { ChannelsService } from './channels.service';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [],
  providers: [ChatGateway, ChannelsService, PrismaService, UserService],
})
export class ChatModule {}
