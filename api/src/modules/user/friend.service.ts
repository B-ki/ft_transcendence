import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async addFriend(user: User, friendLogin: string) {
    const newFriend = await this.prisma.user.findUnique({
      where: {
        login: friendLogin,
      },
      include: {
        friendOf: true,
      },
    });

    if (!newFriend) {
      throw new NotFoundException(`User ${friendLogin} doesn't exist`);
    }

    if (user.id === newFriend.id) {
      throw new BadRequestException('You cannot add yourself as a friend');
    }

    if (newFriend.friendOf.find((f) => f.id === user.id)) {
      throw new BadRequestException('You already added this friend');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          connect: {
            id: newFriend.id,
          },
        },
      },
    });

    return { success: true };
  }

  async removeFriend(user: User, friendToRemoveLogin: string) {
    const friendToRemove = await this.prisma.user.findUnique({
      where: {
        login: friendToRemoveLogin,
      },
      include: {
        friendOf: true,
      },
    });

    if (!friendToRemove) {
      throw new NotFoundException(`User ${friendToRemoveLogin} doesn't exist`);
    }

    if (!friendToRemove.friendOf.find((f) => f.id === user.id)) {
      throw new BadRequestException('You are not friend with this user');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        friends: {
          disconnect: {
            id: friendToRemove.id,
          },
        },
      },
    });

    return { success: true };
  }

  async getFriendList(user: User, friendOf: boolean = false) {
    const u = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        friends: true,
        friendOf: true,
      },
    });

    // User is never null since he is authenticated
    return friendOf ? u!.friendOf : u!.friends;
  }
}
