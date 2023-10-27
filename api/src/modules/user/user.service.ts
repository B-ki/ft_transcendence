import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma';

import { FortyTwoProfile } from '../auth';

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

  async createUser(profile: FortyTwoProfile): Promise<User> {
    return await this.prisma.user.create({ data: profile });
  }

  async testGetFirstName(user: User): Promise<string | undefined> {
    return (
      await this.prisma.user.findUnique({
        where: {
          login: user.login,
        },
      })
    )?.firstName;
  }

  async updateDescription(user: User, newDescription: string): Promise<User> {
    const updateUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        description: newDescription,
      },
    });

    if (!updateUser) {
      throw new NotFoundException(`User ${user.login} not found`);
    }

    return updateUser;
  }

  async updateBanner(user: User, newBanner: string): Promise<User> {
    const updateUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        bannerUrl: newBanner,
      },
    });

    if (!updateUser) {
      throw new NotFoundException(`User ${user.login} not found`);
    }

    return updateUser;
  }

  async updateImage(user: User, newImage: string): Promise<User> {
    const logger = new Logger();
    logger.debug('image url = ', newImage);
    const updateUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        imageUrl: newImage,
      },
    });

    if (!updateUser) {
      throw new NotFoundException(`User ${user.login} not found`);
    }

    return updateUser;
  }

  async updateUsername(user: User, newUsername: string): Promise<User> {
    const updateUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        username: newUsername,
      },
    });

    if (!updateUser) {
      throw new NotFoundException(`User ${user.login} not found`);
    }

    return updateUser;
  }
}
