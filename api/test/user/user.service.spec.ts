import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { FortyTwoProfile } from '@/modules/auth';

import { UserService } from '../../src/modules/user';
import { PrismaService } from '../../src/prisma';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module2 = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userService = module2.get(UserService);
    prismaService = module2.get(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should have functions', () => {
    expect(userService.getAll).toBeDefined();
    expect(userService.getUnique).toBeDefined();
    expect(userService.createUser).toBeDefined();
  });

  const user = {
    id: '1',
    login: 'testLogin',
    email: 'testMail',
    imageUrl: 'testUrl',
    displayName: 'testLogin',
    firstName: 'testFirstName',
    lastName: 'testLastName',
    createdAt: new Date(),
  };

  const profile: FortyTwoProfile = {
    login: 'testLogin',
    email: 'testMail',
    imageUrl: 'testUrl',
    displayName: 'testLogin',
    firstName: 'testFirstName',
    lastName: 'testLastName',
  };

  it('should create users correctly', async () => {
    prismaService.user.create.mockResolvedValue(user);
    const result = await userService.createUser(profile);
    expect(result.id).toEqual('1');
    expect(result.login).toEqual(profile.login);
    expect(result.email).toEqual(profile.email);
    expect(result.imageUrl).toEqual(profile.imageUrl);
    expect(result.displayName).toEqual(profile.displayName);
    expect(result.firstName).toEqual(profile.firstName);
    expect(result.lastName).toEqual(profile.lastName);
  });

  it('should get a user correctly', async () => {
    prismaService.user.findUnique.mockResolvedValue(user);
    const result = await userService.getUnique('testLogin');
    expect(result.id).toEqual('1');
    expect(result.login).toEqual(profile.login);
    expect(result.email).toEqual(profile.email);
    expect(result.imageUrl).toEqual(profile.imageUrl);
    expect(result.displayName).toEqual(profile.displayName);
    expect(result.firstName).toEqual(profile.firstName);
    expect(result.lastName).toEqual(profile.lastName);
  });

  it('should throw an error for non-existing user', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);

    try {
      await userService.getUnique('nonExistentUser');
    } catch (error) {
      expect(error.message).toBe('User nonExistentUser not found');
    }
  });

  it('should get all users correctly', () => {
    const users = [user];

    prismaService.user.findMany.mockResolvedValue(users);

    expect(userService.getAll()).resolves.toEqual(users);
  });
});
