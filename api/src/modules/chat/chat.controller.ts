import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

import { GetUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { ChannelsService } from './channels.service';
import { CreateChannelDTO } from './chat.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private channelsService: ChannelsService) {}

  @Post('/createChannel')
  createChannel(@Body() channel: CreateChannelDTO, @GetUser() user: User) {
    return this.channelsService.createChannel(channel, user);
  }
}
