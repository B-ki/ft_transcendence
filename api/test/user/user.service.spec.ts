import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { CreateUserDto } from '@/modules/auth';

import { FriendService, UserService } from '../../src/modules/user';
import { PrismaService } from '../../src/prisma';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: DeepMockProxy<PrismaClient>;
  let friendService: FriendService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, FriendService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    userService = module.get(UserService);
    prismaService = module.get(PrismaService);
    friendService = module.get(FriendService);
  });

  it('services should be defined', () => {
    expect(userService).toBeDefined();
    expect(friendService).toBeDefined();
  });

  it('should have functions', () => {
    expect(userService.getUnique).toBeDefined();
    expect(userService.createUser).toBeDefined();
    expect(userService.updateBanner).toBeDefined();
    expect(userService.updateImage).toBeDefined();
    expect(userService.updateDisplayName).toBeDefined();
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
    bannerUrl: 'bannerUrl',
    description: 'description',
    createdAt: new Date(),
  };

  const profile: CreateUserDto = {
    login: 'testLogin',
    email: 'testMail',
    imageUrl: 'testUrl',
    displayName: 'testLogin',
    firstName: 'testFirstName',
    lastName: 'testLastName',
    isConnected: true,
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
    const userDescription = {
      id: 1,
      login: 'testLogin',
      email: 'testMail',
      imageUrl: 'testUrl',
      displayName: 'testLogin',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      isConnected: true,
      bannerUrl: 'bannerUrl',
      description: 'newDescription',
      createdAt: new Date(),
    };

    prismaService.user.update.mockResolvedValue(userDescription);
    const result = await userService.updateImage(user, 'new Banner');
    expect(result).toEqual(userDescription);
  });

  it('should update displayName', async () => {
    const userDisplayName = {
      id: 1,
      login: 'testLogin',
      email: 'testMail',
      imageUrl: 'testUrl',
      displayName: 'newDisplayName',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      isConnected: true,
      bannerUrl: 'bannerUrl',
      description: 'description',
      createdAt: new Date(),
    };

    prismaService.user.update.mockResolvedValue(userDisplayName);
    const result = await userService.updateImage(user, 'new displayName');
    expect(result).toEqual(userDisplayName);
  });

  it('should update imageUrl', async () => {
    const userImageUrl = {
      id: 1,
      login: 'testLogin',
      email: 'testMail',
      imageUrl: 'new imageUrl',
      displayName: 'newDisplayName',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      isConnected: true,
      bannerUrl: 'bannerUrl',
      description: 'description',
      createdAt: new Date(),
    };

    prismaService.user.update.mockResolvedValue(userImageUrl);
    const result = await userService.updateImage(user, 'new displayName');
    expect(result).toEqual(userImageUrl);
  });

  it('should update bannerUrl', async () => {
    const userBannerUrl = {
      id: 1,
      login: 'testLogin',
      email: 'testMail',
      imageUrl: 'new imageUrl',
      displayName: 'newDisplayName',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      isConnected: true,
      bannerUrl: 'new bannerUrl',
      description: 'description',
      createdAt: new Date(),
    };

    prismaService.user.update.mockResolvedValue(userBannerUrl);
    const result = await userService.updateImage(user, 'new displayName');
    expect(result).toEqual(userBannerUrl);
  });

  /*it('addFriend and getFriendList', async () => {
    const newFriend = {
      id: 2,
      login: 'copaing',
      email: 'email@ducopaing.fr',
      imageUrl: 'imageDuCopaing',
      displayName: 'Tony labricot',
      firstName: 'Tony',
      lastName: 'Labricot',
      isConnected: true,
      bannerUrl: 'Abricot banner',
      description: 'Abricot cest beau la vie',
      createdAt: new Date(),
      friendOf: [],
      friends: [],
    };

    const newFriendList = [newFriend];
    prismaService.user.create.mockResolvedValueOnce(newFriend);
    await userService.createUser(newFriend);
    prismaService.user.findUnique.mockResolvedValueOnce(newFriend);
    prismaService.user.update.mockResolvedValueOnce(newFriend);
    await friendService.addFriend(user, 'copaing');
    prismaService.user.findMany.mockResolvedValueOnce(newFriendList);
    const result = await friendService.getFriendList(user);
    expect(result).toEqual(newFriendList);
  });
  */
});
