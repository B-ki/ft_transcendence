import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma';

import { CreateUserDto } from '../auth';

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

  async updateDisplayName(user: User, newName: string): Promise<User> {
    if (await this.isDisplayNameInUse(newName)) {
      throw new BadRequestException(`Display name ${newName} is already in use`);
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        login: user.login,
      },
      data: {
        displayName: newName,
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
}
