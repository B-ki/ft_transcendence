import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma';

import { UserService } from '../user';
import { ChannelsService } from './channels.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, ChannelsService, PrismaService, UserService],
})
export class ChatModule {}
