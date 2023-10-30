import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) {}

  async addFriend(user: User, friendLogin: string) {
    const newFriend = await this.prisma.user.findUnique({
      where: {
        login: friendLogin,
      },
    });

    if (!newFriend) {
      throw new NotFoundException('Friend doesnt exists');
    }

    if (user === newFriend) {
      throw new BadRequestException('Cant add user to its own friendlist');
    }
    // Check if newFriend not in friend list
    const newFriendInFriendlist = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        friends: {
          where: {
            id: newFriend.id,
          },
        },
      },
    });

    if (newFriendInFriendlist?.friends.length) {
      throw new BadRequestException('User already in friend list!');
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
  }

  async removeFriend(user: User, friendToRemoveLogin: string) {
    const friendToRemove = await this.prisma.user.findUnique({
      where: {
        login: friendToRemoveLogin,
      },
    });

    if (!friendToRemove) {
      throw new NotFoundException('Friend doesnt exists');
    }
    if (user === friendToRemove) {
      throw new BadRequestException('Cant delete user from its own friendlist');
    }
    // Check if friendToRemove not in friend list
    const friendToRemoveFriendlist = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        friends: {
          where: {
            id: friendToRemove.id,
          },
        },
      },
    });

    if (friendToRemoveFriendlist?.friends.length === 0) {
      throw new BadRequestException('User not in friend list!');
    }

    // Delete friendToRemove from user friends
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
  }

  async getFriendList(user: User) {
    return await this.prisma.user.findMany({
      where: {
        id: user.id,
      },
      include: {
        friends: true,
      },
    });
  }
}
