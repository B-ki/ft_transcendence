import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user';
import { FortyTwoProfile, JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  generateJWT(payload: JwtPayload): { accessToken: string } {
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }

  login(profile: FortyTwoProfile): { accessToken: string } {
    const user = this.userService.getUnique(profile.id);
    if (!user) {
      this.userService.createUser(profile);
    }
    const payload: JwtPayload = { username: profile.login };
    const { accessToken } = this.generateJWT(payload);
    return { accessToken };
  }
}
