import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.user.findMany();
  }
}