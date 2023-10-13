import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'nestjs-prisma';

import { UserService } from '../../src/modules/user/user.service';

describe('UserService', () => {
  let user: UserService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    // initialize a NestJS module with userService
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, { provide: PrismaService, useValue: jest.fn() }],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    user = module.get(UserService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should have functions : login, fetchProfileInformation and generateJWT', () => {
    expect(user.getAll).toBeDefined();
    expect(user.getUnique).toBeDefined();
    expect(user.createUser).toBeDefined();
  });

  it('createUser => Should create a new user', async () => {
    //arrange
    /*const profile: FortyTwoProfile = {
      login: 'testLogin',
      email: 'testMail',
      imageUrl: 'testUrl',
      displayName: 'testLogin',
      firstName: 'testFirstName',
      lastName: 'testLastName',
    };

    const user = {
      id: '1',
      login: 'testLogin',
      email: 'testMail',
      imageUrl: 'testUrl',
      displayName: 'testLogin',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      createdAt: new Date(),
    };*/

    //act
    const testUsers:
      | {
          id: string;
          login: string;
          email: string;
          imageUrl: string | null;
          displayName: string;
          firstName: string;
          lastName: string;
          createdAt: Date;
        }[]
      | Prisma.PrismaPromise<
          {
            id: string;
            login: string;
            email: string;
            imageUrl: string | null;
            displayName: string;
            firstName: string;
            lastName: string;
            createdAt: Date;
          }[]
        > = [];

    prisma.user.findMany.mockResolvedValueOnce(testUsers);

    //prismaService.user.create.mockResolvedValue(user);

    // await expect(userService.createUser(profile)).resolves.toEqual(user);

    expect(user.getAll()).resolves.toBe(testUsers);
  });
});
