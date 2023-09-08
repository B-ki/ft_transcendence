import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UserService } from '../user';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;

  const mockJwtService = {

  };

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

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should have a login, fetchProfileInformation and generateJWT', () => {
    expect(authService.login).toBeDefined();
    expect(authService.fetchProfileInformations).toBeDefined();
    expect(authService.generateJWT).toBeDefined();
  });
});
