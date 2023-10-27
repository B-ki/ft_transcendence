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
    const module = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userService = module.get(UserService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should have functions', () => {
    expect(userService.getUnique).toBeDefined();
    expect(userService.createUser).toBeDefined();
    expect(userService.updateBanner).toBeDefined();
    expect(userService.updateImage).toBeDefined();
    expect(userService.updateUsername).toBeDefined();
    expect(userService.updateDescription).toBeDefined();
  });

  const user = {
    id: 1,
    login: 'testLogin',
    email: 'testMail',
    imageUrl: 'testUrl',
    displayName: 'testLogin',
    firstName: 'testFirstName',
    lastName: 'testLastName',
    isConnected: true,
    username: 'testLogin',
    bannerUrl: 'bannerUrl',
    description: 'description',
    createdAt: new Date(),
  };

  const profile: FortyTwoProfile = {
    login: 'testLogin',
    email: 'testMail',
    imageUrl: 'testUrl',
    displayName: 'testLogin',
    firstName: 'testFirstName',
    lastName: 'testLastName',
    isConnected: true,
    username: 'testLogin2',
    bannerUrl: 'bannerUrl',
    description: 'description',
  };

  it('should create users correctly', async () => {
    prismaService.user.create.mockResolvedValue(user); // result will be equal to user
    const result = await userService.createUser(profile);
    expect(result).toEqual(user);
  });

  it('should get a user correctly', async () => {
    prismaService.user.findUnique.mockResolvedValue(user);
    const result = await userService.getUnique('testLogin');
    expect(result).toEqual(user);
  });

  it('should throw an error for non-existing user', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);

    try {
      await userService.getUnique('nonExistentUser');
    } catch (error) {
      expect(error.message).toBe('User nonExistentUser not found');
    }
  });

  it('should update the description', async () => {
    prismaService.user.update.mockResolvedValue(user);
    const result = await userService.updateImage(user, 'new Banner');
    expect(result).toEqual(user);
  });
});
