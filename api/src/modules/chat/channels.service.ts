import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChannelRole, ChannelType, Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

import { config } from '@/config';

import { UserService } from '../user';
import {
  CreateChannelDTO,
  DemoteUserDTO,
  JoinChannelDTO,
  LeaveChannelDTO,
  MessageHistoryDTO,
  PromoteUserDTO,
  SendMessageDTO,
  UpdateChannelDTO,
  UserListInChannelDTO,
} from './chat.dto';

type ChannelWithUsers = Prisma.ChannelGetPayload<{ include: { users: true } }>;

@Injectable()
export class ChannelsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getChannel(channelName: string): Promise<ChannelWithUsers> {
    const channel = await this.prisma.channel.findUnique({
      where: {
        name: channelName,
      },
      include: { users: true },
    });

    if (!channel) {
      throw new WsException(`Channel ${channelName} not found`);
    }

    return channel;
  }

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

  async joinChannel(channelDTO: JoinChannelDTO, user: User) {
    const channel = await this.getChannel(channelDTO.name);

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

    const channelUser = await this.prisma.channelUser.create({
      data: {
        user: { connect: user },
        role: ChannelRole.USER,
        channel: { connect: { name: channelDTO.name } },
      },
      include: {
        user: true,
      },
    });

    return {
      channel: channel.name,
      user: {
        ...channelUser.user,
        role: ChannelRole.USER,
      },
    };
  }

  async leaveChannel(channelDTO: LeaveChannelDTO, user: User, reason?: string) {
    const channel = await this.getChannel(channelDTO.name);

    const channelUser = channel.users.find((u) => u.userId === user.id);
    if (!channelUser) {
      throw new WsException('You are not in this channel');
    }

    await this.prisma.channelUser.delete({
      where: {
        userId_channelId: {
          userId: user.id,
          channelId: channel.id,
        },
      },
    });

    if (channel.users.length <= 1) {
      // delete the channel if the last user left
      await this.prisma.channel.delete({
        where: {
          name: channel.name,
        },
      });
    }

    return {
      channel: channel.name,
      user: user,
      reason: reason ? reason : 'disconnected',
    };
  }

  async sendMessage(message: SendMessageDTO, user: User) {
    const channel = await this.getChannel(message.channel);

    const channelUser = channel.users.find((u) => u.userId === user.id);
    if (!channelUser) {
      throw new WsException('You are not in this channel');
    }

    const created = await this.prisma.message.create({
      data: {
        content: message.content,
        author: { connect: { id: user.id } },
        channel: { connect: { name: channel.name } },
      },
      include: {
        author: true,
      },
    });

    return {
      content: message.content,
      channel: channel.name,
      author: {
        ...created.author,
        role: channelUser.role,
      },
    };
  }

  async getMessageHistory(dto: MessageHistoryDTO, user: User) {
    const channel = await this.getChannel(dto.channel);
    const channelUser = channel.users.find((u) => u.userId === user.id);

    if (!channelUser) {
      throw new WsException(`You are not in channel ${channel.name}`);
    }

    if (!dto.offset) {
      dto.offset = 0;
    }

    return await this.prisma.message.findMany({
      where: {
        channel: { name: dto.channel },
      },
      include: {
        author: true,
      },
      skip: dto.offset,
      take: dto.limit,
    });
  }

  async updateChannel(updateData: UpdateChannelDTO, user: User) {
    const channel = await this.getChannel(updateData.name);
    const channelUser = channel.users.find((u) => u.userId === user.id);

    if (!channelUser) {
      throw new WsException(`You are not in channel ${channel.name}`);
    }

    if (channelUser.role !== ChannelRole.OWNER) {
      throw new WsException('You must be the channel owner to modify the channel visibility');
    }

    let hashedPassword = null;
    if (updateData.type === ChannelType.PROTECTED) {
      hashedPassword = await bcrypt.hash(updateData.password, config.bcrypt.saltRounds);
    }

    await this.prisma.channel.update({
      where: {
        id: channel.id,
      },
      data: {
        type: updateData.type,
        password: hashedPassword,
      },
    });
  }

  async getChannelList() {
    const channels = await this.prisma.channel.findMany({
      where: {
        type: {
          not: ChannelType.PRIVATE,
        },
        isDM: {
          not: true,
        },
      },
      // exclude password and isDM field
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        name: true,
      },
    });

    return channels;
  }

  async getJoinedChannels(user: User) {
    const channelUsers = await this.prisma.channelUser.findMany({
      where: { user: user },
      include: { channel: true },
    });

    // return the channel list without the password field
    return channelUsers.map((cu) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...channelWithoutPassword } = cu.channel;
      return channelWithoutPassword;
    });
  }

  async getUserListInChannel(dto: UserListInChannelDTO, user: User) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        name: dto.channel,
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!channel) {
      throw new WsException(`Channel ${dto.channel} not found`);
    }

    const channelUser = channel.users.find((u) => u.userId === user.id);
    if (!channelUser) {
      throw new WsException(`You are not in channel ${channel.name}`);
    }

    const usersWithRole = channel.users.map(({ user, role }) => ({
      ...user,
      role,
    }));

    return {
      channel: channel.name,
      users: usersWithRole,
    };
  }

  async promoteUser(promotion: PromoteUserDTO, user: User) {
    const channel = await this.getChannel(promotion.channel);
    const channelUser = channel.users.find((u) => u.userId === user.id);

    if (!channelUser) {
      throw new WsException(`You are not in channel ${channel.name}`);
    }

    if (channelUser.role !== ChannelRole.OWNER) {
      throw new WsException('You must be the channel owner to promote someone');
    }

    if (promotion.login === user.login) {
      throw new WsException('You cannot promote yourself');
    }

    // to get user id from login and check if user exists
    const toPromoteUser = await this.userService.getUnique(promotion.login);
    const toPromoteChannelUser = channel.users.find((u) => u.userId === toPromoteUser.id);

    if (!toPromoteChannelUser) {
      throw new WsException(`${toPromoteUser.login} is not in channel ${channel.name}`);
    }

    const updatedChannelUser = await this.prisma.channelUser.update({
      where: {
        userId_channelId: {
          channelId: channel.id,
          userId: toPromoteUser.id,
        },
      },
      data: {
        role: ChannelRole.ADMIN,
      },
      include: {
        user: true,
      },
    });

    return {
      ...updatedChannelUser.user,
      role: updatedChannelUser.role,
    };
  }

  async demoteUser(demotion: DemoteUserDTO, user: User) {
    const channel = await this.getChannel(demotion.channel);
    const channelUser = channel.users.find((u) => u.userId === user.id);

    if (!channelUser) {
      throw new WsException(`You are not in channel ${channel.name}`);
    }

    if (channelUser.role !== ChannelRole.OWNER) {
      throw new WsException('You must be the channel owner to demote someone');
    }

    if (demotion.login === user.login) {
      throw new WsException('You cannot demote yourself');
    }

    // to get user id from login and check if user exists
    const toDemoteUser = await this.userService.getUnique(demotion.login);
    const toDemoteChannelUser = channel.users.find((u) => u.userId === toDemoteUser.id);

    if (!toDemoteChannelUser) {
      throw new WsException(`${toDemoteUser.login} is not in channel ${channel.name}`);
    }

    const updatedChannelUser = await this.prisma.channelUser.update({
      where: {
        userId_channelId: {
          channelId: channel.id,
          userId: toDemoteUser.id,
        },
      },
      data: {
        role: ChannelRole.USER,
      },
      include: {
        user: true,
      },
    });

    return {
      ...updatedChannelUser.user,
      role: updatedChannelUser.role,
    };
  }
}
