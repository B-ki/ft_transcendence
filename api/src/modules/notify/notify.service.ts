import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Socket } from 'socket.io';

import { FriendService, UserService } from '../user';

@Injectable()
export class NotifyService {
  public sockets: Map<string, Socket[]>;

  constructor(
    private friendService: FriendService,
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  async emitToFriends(user: User, status: UserStatus) {
    const friends = await this.friendService.getFriendList(user, true);

    for (const friend of friends) {
      const sockets = this.sockets?.get(friend.login) || [];
      for (const socket of sockets) {
        socket.emit('notify', { user: user, status: status });
      }
    }
  }

  async setStatus(user: User, status: UserStatus) {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: status,
      },
    });
  }

  async getStatus(user: User): Promise<UserStatus> {
    return (await this.userService.getUnique(user.login)).status;
  }

  async online(user: User) {
    await this.emitToFriends(user, UserStatus.ONLINE);
    await this.setStatus(user, UserStatus.ONLINE);
  }

  async offline(user: User) {
    await this.emitToFriends(user, UserStatus.OFFLINE);
    await this.setStatus(user, UserStatus.OFFLINE);
  }

  async inGame(user: User) {
    await this.emitToFriends(user, UserStatus.INGAME);
    await this.setStatus(user, UserStatus.INGAME);
  }
}
