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
      throw new NotFoundException('Friend doesnt exists');
    }

    if (user === newFriend) {
      throw new BadRequestException('Cant add user to its own friendlist');
    }

    // Check if we're not already friend with that user
    if (newFriend.friendOf.find((f) => f.id === user.id)) {
      throw new BadRequestException('You already added this friend');
    }

    // Add newFriend to user friends
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

    // Add user to newFriend friendOf
    await this.prisma.user.update({
      where: {
        id: newFriend.id,
      },
      data: {
        friendOf: {
          connect: {
            id: user.id,
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
      throw new NotFoundException('Friend doesnt exists');
    }

    // Check if we're friend with user
    if (!friendToRemove.friendOf.find((f) => f.id === user.id)) {
      throw new BadRequestException('You are not friend with this user');
    }

    // Delete friendToRemove from user friendlist
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

    // Delete user from user friendToRemove friendOf
    await this.prisma.user.update({
      where: {
        id: friendToRemove.id,
      },
      data: {
        friendOf: {
          disconnect: {
            id: user.id,
          },
        },
      },
    });

    return { success: true };
  }

  async getFriendList(user: User) {
    const u = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        friends: true,
      },
    });

    // user is never null since it's authenticated
    return u!.friends;
  }
}
