import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    // initialize a NestJS module with authService
    const module = await Test.createTestingModule({
      providers: [AuthService],
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
