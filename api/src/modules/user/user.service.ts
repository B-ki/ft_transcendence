import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma';

import { FortyTwoProfile } from '../auth';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

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
}
