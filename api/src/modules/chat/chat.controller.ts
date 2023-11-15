import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtTwoFaAuthGuard } from '../auth';
import { ChannelsService } from './channels.service';

@Controller('chat')
@UseGuards(JwtTwoFaAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private channelsService: ChannelsService) {}

  @Get('/channelList')
  async getMyUser() {
    return await this.channelsService.getChannelList();
  }
}
