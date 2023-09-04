import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma';

import { FortyTwoProfile } from '../auth';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUnique(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: username,
      },
    });
    if (!user) {
      throw Promise.reject('User does not exists');
    }
    return user;
  }

  async createUser(profile: FortyTwoProfile) {
    const user: User = profile;
    user.createdAt = new Date();
    this.prisma.user.create({ data: user });
  }
}
