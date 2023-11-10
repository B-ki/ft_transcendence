import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '@prisma/client';
import { Socket } from 'socket.io';

import { FriendService } from '../user';

@Injectable()
export class NotifyService {
  public sockets: Map<string, Socket>;

  constructor(private friendService: FriendService) {}

  async emitToFriends(user: User, status: UserStatus) {
    const friends = await this.friendService.getFriendList(user, true);

    for (const friend of friends) {
      const socket = this.sockets.get(friend.login);

      if (socket) {
        socket.emit('notify', { user: user, status: status });
      }
    }
  }

  async online(user: User) {
    await this.emitToFriends(user, UserStatus.ONLINE);
  }

  async offline(user: User) {
    await this.emitToFriends(user, UserStatus.OFFLINE);
  }

  async inGame(user: User) {
    await this.emitToFriends(user, UserStatus.INGAME);
  }
}
