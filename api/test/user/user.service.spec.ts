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
    // arrange
    // assert

    //act
    prismaService.user.create.mockResolvedValueOnce(user);
    const result = await userService.createUser(profile);

    // Validate that the created user matches the profile
    expect(result.id).toEqual('1');
    expect(result.login).toEqual(profile.login);
    expect(result.email).toEqual(profile.email);
    expect(result.imageUrl).toEqual(profile.imageUrl);
    expect(result.displayName).toEqual(profile.displayName);
    expect(result.firstName).toEqual(profile.firstName);
    expect(result.lastName).toEqual(profile.lastName);
  });

  it('should get users correctly', async () => {
    // arrange
    // assert

    //act
    prismaService.user.findUnique.mockResolvedValueOnce(user);

    const result = await userService.getUnique('testLogin');

    // Validate that the created user matches the profile
    expect(result.id).toEqual('1');
    expect(result.login).toEqual(profile.login);
    expect(result.email).toEqual(profile.email);
    expect(result.imageUrl).toEqual(profile.imageUrl);
    expect(result.displayName).toEqual(profile.displayName);
    expect(result.firstName).toEqual(profile.firstName);
    expect(result.lastName).toEqual(profile.lastName);
  });
});
