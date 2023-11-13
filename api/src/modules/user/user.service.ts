import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma';

import { CreateUserDto } from '../auth';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUnique(login: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${login} not found`);
    }

    return user;
  }

  async createUser(profile: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data: profile });
  }

  async updateUser(user: User, updateDto: UpdateUserDto): Promise<User> {
    if (
      updateDto.displayName &&
      (await this.isDisplayNameInUse(updateDto.displayName)) &&
      user.displayName != updateDto.displayName
    ) {
      throw new BadRequestException(`Display name ${updateDto.displayName} is already in use`);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        ...(updateDto.displayName !== undefined && { displayName: updateDto.displayName }),
        ...(updateDto.bannerUrl !== undefined && { bannerUrl: updateDto.bannerUrl }),
        ...(updateDto.imageUrl !== undefined && { imageUrl: updateDto.imageUrl }),
        ...(updateDto.description !== undefined && { description: updateDto.description }),
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User ${user.login} not found`);
    }

    return updatedUser;
  }

  async isDisplayNameInUse(name: string): Promise<boolean> {
    return !!(await this.prisma.user.findUnique({
      where: {
        displayName: name,
      },
    }));
  }

  async setTwoFaSecret(secret: string, user: User) {
    const updatedUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        twoFactorAuthSecret: secret,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User ${user.login} not found`);
    }

    return updatedUser;
  }

  async enableTwoFa(user: User) {
    const updatedUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        isTwoFaEnabled: true,
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User ${user.login} not found`);
    }

    return updatedUser;
  }

  async disableTwoFa(user: User) {
    const updatedUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        isTwoFaEnabled: false,
        twoFactorAuthSecret: '',
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User ${user.login} not found`);
    }

    return updatedUser;
  }

  async isTwoFaEnabled(user: User): Promise<boolean> {
    return user.isTwoFaEnabled;
  }

  async blockUser(blockedUserLogin: string, user: User) {
    if (blockedUserLogin === user.login) {
      throw new BadRequestException('You cannot block yourself');
    }

    // make sure that the other user exists
    await this.getUnique(blockedUserLogin);

    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        blocked: {
          connect: { login: blockedUserLogin },
        },
      },
      include: {
        blocked: true,
      },
    });
  }

  async unblockUser(toUnblockLogin: string, user: User) {
    // make sure that the other user exists
    await this.getUnique(toUnblockLogin);

    return await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        blocked: {
          disconnect: { login: toUnblockLogin },
        },
      },
      include: {
        blocked: true,
      },
    });
  }

  async getBlockedList(user: User) {
    const userWithBlocked = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        blocked: true,
      },
    });

    return userWithBlocked!.blocked;
  }
}
