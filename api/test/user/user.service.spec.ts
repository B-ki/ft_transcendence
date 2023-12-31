import { Test } from '@nestjs/testing';
import { PrismaClient, UserStatus } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { CreateUserDto } from '@/modules/auth';
import { UpdateUserDto } from '@/modules/user/user.dto';

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
    expect(userService.updateUser).toBeDefined();
  });

  const user = {
    id: 1,
    login: 'testLogin',
    imagePath: 'testUrl',
    displayName: 'testLogin',
    status: UserStatus.ONLINE,
    intraImageURL: 'intraimage',
    bannerPath: 'bannerPath',
    description: 'description',
    createdAt: new Date(),
  };

  const profile: CreateUserDto = {
    login: 'testLogin',
    imagePath: 'testUrl',
    displayName: 'testLogin',
    status: UserStatus.ONLINE,
    intraImageURL: 'intraimage',
    bannerPath: 'bannerPath',
    description: 'description',
  };

  const userDto: UpdateUserDto = {
    displayName: 'Joe',
    description: 'Nimp',
    bannerPath: 'banner',
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

  it('should update user', async () => {
    const userbannerPath = {
      id: 1,
      login: 'testLogin',
      imagePath: 'new imagePath',
      displayName: 'newDisplayName',
      status: UserStatus.ONLINE,
      intraImageURL: 'intraimage',
      bannerPath: 'new bannerPath',
      description: 'description',
      createdAt: new Date(),
    };

    prismaService.user.update.mockResolvedValue(userbannerPath);
    const result = await userService.updateUser(user, userDto);
    expect(result).toEqual(userbannerPath);
  });

  /*it('addFriend and getFriendList', async () => {
    const newFriend = {
      id: 2,
      login: 'copaing',
      email: 'email@ducopaing.fr',
      imagePath: 'imageDuCopaing',
      displayName: 'Tony labricot',
      firstName: 'Tony',
      lastName: 'Labricot',
      isConnected: true,
      bannerPath: 'Abricot banner',
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
