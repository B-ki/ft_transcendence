import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { prismaMock } from 'test/singleton';

import { FortyTwoProfile } from '@/modules/auth';

import { AuthService } from '../../src/modules/auth/auth.service';
import { UserService } from '../../src/modules/user';

describe('UserService', () => {
  let userService: UserService;

  const mockJwtService = {};

  // CONTINUE FROM THERE TO CREATE THE USER TEST
  const mockUserService = {
    getAll: jest.fn(),
    getUnique: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    // initialize a NestJS module with authService
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  // it = "test case"
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should have functions : login, fetchProfileInformation and generateJWT', () => {
    expect(authService.login).toBeDefined();
    expect(authService.fetchProfileInformations).toBeDefined();
    expect(authService.generateJWT).toBeDefined();
  });

  it("login => Should create a new user if it doesn't exists", async () => {
    //arrange
    const profile: FortyTwoProfile = {
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
    };

    //act
    prismaMock.user.create.mockResolvedValue(user);

    await expect(UserService.).resolves.toEqual
  });
});
