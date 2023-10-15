import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { UserService } from '../../src/modules/user';
import { PrismaService } from '../../src/prisma';

const testUser = {
  id: '1',
  login: 'testLogin',
  email: 'testMail',
  imageUrl: 'testUrl',
  displayName: 'testLogin',
  firstName: 'testFirstName',
  lastName: 'testLastName',
  createdAt: new Date(),
};
const testUser2 = {
  id: '2',
  login: 'testLogin2',
  email: 'testMail2',
  imageUrl: 'testUrl2',
  displayName: 'testLogin2',
  firstName: 'testFirstName2',
  lastName: 'testLastName2',
  createdAt: new Date(),
};
const testArray = [testUser, testUser2];

const db = {
  user: {
    findMany: jest.fn().mockResolvedValue(testArray),
    findUnique: jest.fn().mockResolvedValue(testUser),
    create: jest.fn().mockReturnValue(testUser),
  },
};

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module2 = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: db }],
    }).compile();

    userService = module2.get<UserService>(UserService);
    prismaService = module2.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should have functions', () => {
    expect(userService.getAll).toBeDefined();
    expect(userService.getUnique).toBeDefined();
    expect(userService.createUser).toBeDefined();
  });
});
