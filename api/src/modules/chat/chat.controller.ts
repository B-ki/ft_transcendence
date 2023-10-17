import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards';
import { ChannelsService } from './channels.service';
import { CreateChannelDTO } from './chat.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private channelsService: ChannelsService) {}

  @Post('/createChannel')
  async createChannel(@Body() channel: CreateChannelDTO) {
    return this.channelsService.createChannel(channel);
  }
}
