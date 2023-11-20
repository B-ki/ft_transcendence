import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChannelRole, ChannelType, Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'nestjs-prisma';

import { config } from '@/config';

import { UserService } from '../user';
import {
  BanUserDTO,
  CreateChannelDTO,
  DemoteUserDTO,
  JoinChannelDTO,
  KickUserDTO,
  LeaveChannelDTO,
  MessageHistoryDTO,
  MuteUserDTO,
  PromoteUserDTO,
  SendDmDTO,
  SendMessageDTO,
  UpdateChannelDTO,
  UserListInChannelDTO,
} from './chat.dto';

type ChannelWithUsers = Prisma.ChannelGetPayload<{ include: { users: true } }>;

@Injectable()
export class ChannelsService {
  private muted = new Set<number>();

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
      const createdChannel: any = await this.prisma.channel.create({
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

      delete createdChannel.password;
      return createdChannel;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Channel name must be unique');
      }
      throw e;
    }
  }

  async joinChannel(channelDTO: JoinChannelDTO, user: User) {
    const channel = await this.prisma.channel.findUnique({
      where: {
        name: channelDTO.name,
      },
      include: { users: true, bans: true },
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

    if (channel.bans.some((u) => u.id === user.id)) {
      throw new WsException('You are banned from this channel');
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
      toChannel: {
        channel: channel.name,
        user: {
          ...channelUser.user,
          role: ChannelRole.USER,
        },
      },
      toClient: {
        id: channel.id,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
        name: channel.name,
        type: channel.type,
        isDM: channel.isDM,
      },
    };
  }

  async leaveChannel(channelDTO: LeaveChannelDTO, user: User, reason?: string) {
    const channel = await this.getChannel(channelDTO.name);

    if (channel.isDM) {
      throw new WsException('You cannot leave a DM');
    }

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

    if (this.muted.has(user.id)) {
      throw new WsException('You are muted in this channel');
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
      createdAt: created.createdAt,
      content: created.content,
      channel: channel.name,
      user: {
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

    const messages = await this.prisma.message.findMany({
      where: {
        channel: { name: dto.channel },
      },
      include: {
        author: true,
      },
      skip: dto.offset,
      take: dto.limit,
    });

    return messages.map((msg) => {
      const channelUser = channel.users.find((u) => u.userId === msg.authorId);

      return {
        createdAt: msg.createdAt,
        content: msg.content,
        channel: channel.name,
        user: {
          ...msg.author,
          role: channelUser ? channelUser.role : ChannelRole.USER,
        },
      };
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
    const channels: any = await this.prisma.channel.findMany({
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
        messages: {
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
    });

    channels.forEach((channel: any) => {
      if (channel.type === ChannelType.PUBLIC) {
        channel.lastMessage = channel.messages[0];
      }

      delete channel.messages;
    });

    return channels;
  }

  async getJoinedChannels(user: User) {
    const channelUsers = await this.prisma.channelUser.findMany({
      where: {
        user: user,
      },
      include: {
        channel: {
          include: {
            messages: {
              orderBy: {
                id: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    // return the channel list without the password field
    // and with last message
    return channelUsers.map((cu: any) => {
      cu.channel.lastMessage = cu.channel.messages[0];
      delete cu.channel.messages;

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

  async kickUser(kick: KickUserDTO, user: User) {
    const channel = await this.getChannel(kick.channel);
    const channelUser = channel.users.find((u) => u.userId === user.id);

    if (!channelUser) {
      throw new WsException(`You are not in channel ${channel.name}`);
    }

    if (channelUser.role === ChannelRole.USER) {
      throw new WsException('You must be an administrator to kick someone');
    }

    if (kick.login === user.login) {
      throw new WsException('You cannot kick yourself');
    }

    const toKickUser = await this.userService.getUnique(kick.login);
    const toKickChannelUser = channel.users.find((u) => u.userId === toKickUser.id);

    if (!toKickChannelUser) {
      throw new WsException(`${toKickUser.login} is not in channel ${channel.name}`);
    }

    if (toKickChannelUser.role !== ChannelRole.USER) {
      throw new WsException('You can only kick regular users');
    }

    let reason = `Kicked by ${user.login}: `;
    reason += kick.reason ? kick.reason : 'no reason specified';

    return await this.leaveChannel({ name: kick.channel }, toKickUser, reason);
  }

  async banUser(ban: BanUserDTO, user: User) {
    const channel = await this.getChannel(ban.channel);
    const channelUser = channel.users.find((u) => u.userId === user.id);

    if (!channelUser) {
      throw new WsException(`You are not in channel ${channel.name}`);
    }

    if (channelUser.role === ChannelRole.USER) {
      throw new WsException('You must be an administrator to ban someone');
    }

    if (ban.login === user.login) {
      throw new WsException('You cannot ban yourself');
    }

    const toBanUser = await this.userService.getUnique(ban.login);
    const toBanChannelUser = channel.users.find((u) => u.userId === toBanUser.id);

    if (!toBanChannelUser) {
      throw new WsException(`${toBanUser.login} is not in channel ${channel.name}`);
    }

    if (toBanChannelUser.role !== ChannelRole.USER) {
      throw new WsException('You can only ban regular users');
    }

    let reason = `Banned by ${user.login}: `;
    reason += ban.reason ? ban.reason : 'no reason specified';

    await this.prisma.channel.update({
      where: {
        id: channel.id,
      },
      data: {
        bans: {
          connect: { id: toBanUser.id },
        },
      },
    });

    return await this.leaveChannel({ name: ban.channel }, toBanUser, reason);
  }

  async muteUser(mute: MuteUserDTO, user: User) {
    const channel = await this.getChannel(mute.channel);
    const channelUser = channel.users.find((u) => u.userId === user.id);

    if (!channelUser) {
      throw new WsException(`You are not in channel ${channel.name}`);
    }

    if (channelUser.role === ChannelRole.USER) {
      throw new WsException('You must be an administrator to mute someone');
    }

    if (mute.login === user.login) {
      throw new WsException('You cannot mute yourself');
    }

    const toMuteUser = await this.userService.getUnique(mute.login);
    const toMuteChannelUser = channel.users.find((u) => u.userId === toMuteUser.id);

    if (!toMuteChannelUser) {
      throw new WsException(`${toMuteUser.login} is not in channel ${channel.name}`);
    }

    if (toMuteChannelUser.role !== ChannelRole.USER) {
      throw new WsException('You can only mute regular users');
    }

    let reason = `Muted by ${user.login} for ${mute.duration} seconds: `;
    reason += mute.reason ? mute.reason : 'no reason specified';

    this.muted.add(toMuteUser.id);
    setTimeout(() => {
      this.muted.delete(toMuteUser.id);
    }, mute.duration * 1000);

    return {
      channel: channel.name,
      user: toMuteUser,
      reason: reason,
      duration: mute.duration,
    };
  }

  // Generate the DM channel name between 2 users
  // No conflicts possible with an existing channel since '!'
  // character is not authorized in regular channel names
  getDmChannelName(login1: string, login2: string): string {
    if (login1.localeCompare(login2) > 0) {
      return `!${login2}_${login1}`;
    } else {
      return `!${login1}_${login2}`;
    }
  }

  async sendDM(dm: SendDmDTO, user: User) {
    const otherUser = await this.userService.getUnique(dm.login);

    if (otherUser.id === user.id) {
      throw new WsException('You cannot send a direct message to yourself');
    }

    const channelName = this.getDmChannelName(user.login, dm.login);
    const channel = await this.prisma.channel.findUnique({
      where: { name: channelName },
    });

    if (!channel) {
      await this.prisma.channel.create({
        data: {
          name: channelName,
          type: ChannelType.PRIVATE,
          isDM: true,
          users: {
            create: [
              {
                user: { connect: { id: user.id } },
                role: ChannelRole.USER,
              },
              {
                user: { connect: { id: otherUser.id } },
                role: ChannelRole.USER,
              },
            ],
          },
        },
      });
    }

    const created = await this.prisma.message.create({
      data: {
        content: dm.content,
        author: { connect: { id: user.id } },
        channel: { connect: { name: channelName } },
      },
      include: {
        author: true,
      },
    });

    return {
      createdAt: created.createdAt,
      content: created.content,
      channel: channelName,
      user: {
        ...created.author,
        role: ChannelRole.USER,
      },
    };
  }
}
