import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChannelRole, ChannelType, Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

import { config } from '@/config';

import { CreateChannelDTO, JoinChannelDTO } from './chat.dto';

@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  async createChannel(channel: CreateChannelDTO, owner: User): Promise<void> {
    let hashedPassword = null;
    if (channel.type === ChannelType.PROTECTED) {
      hashedPassword = await bcrypt.hash(channel.password, config.bcrypt.saltRounds);
    }

    try {
      await this.prisma.channel.create({
        data: {
          name: channel.name,
          type: channel.type,
          password: hashedPassword,
          isDM: false,
          users: {
            create: [
              {
                user: { connect: owner },
                role: ChannelRole.OWNER,
              },
            ],
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Channel name must be unique');
      }
      throw e;
    }
  }

  async joinChannel(channelDTO: JoinChannelDTO, user: User): Promise<void> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        name: channelDTO.name,
      },
      include: { users: true },
    });

    if (!channel) {
      throw new WsException(`Channel ${channelDTO.name} not found`);
    }

    if (channel.type === ChannelType.PRIVATE) {
      throw new WsException(`Channel ${channel.name} is private`);
    }

    if (channel.type === ChannelType.PROTECTED) {
      if (!channelDTO.password) {
        throw new WsException(`Channel ${channel.name} requires a password`);
      }

      // channel.password is never empty
      const isPasswordValid = await bcrypt.compare(channelDTO.password, channel.password as string);
      if (!isPasswordValid) {
        throw new WsException(`Invalid password for channel ${channel.name}`);
      }
    }

    if (channel.users.some((u) => u.userId === user.id)) {
      throw new WsException('You already joined this channel');
    }

    await this.prisma.channelUser.create({
      data: {
        user: { connect: user },
        role: ChannelRole.USER,
        channel: { connect: { name: channelDTO.name } },
      },
    });
  }
}
