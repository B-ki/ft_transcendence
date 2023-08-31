import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '@/prisma';

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
      throw Promise.reject(new NotFoundException('User does not exists'));
    }
    return user;
  }
}
