import { Module } from '@nestjs/common';

import { ChannelsService } from './channels.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, ChannelsService],
})
export class ChatModule {}
