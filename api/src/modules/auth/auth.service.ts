import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import axios from 'axios';

import { UserService } from '../user';
import { FortyTwoProfile, JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async generateJWT(payload: JwtPayload): Promise<string> {
    const token: string = this.jwtService.sign(payload);
    return token;
  }

  async login(profile: FortyTwoProfile): Promise<string> {
    try {
      await this.userService.getUnique(profile.login);
    } catch (err) {
      if (err instanceof NotFoundException) {
        this.logger.log(`Creating new user ${profile.login}`);
        await this.userService.createUser(profile);
      } else {
        throw err;
      }
    }

    const payload: JwtPayload = { username: profile.login };
    const token = await this.generateJWT(payload);
    this.logger.log(`${profile.login} logged in`);

    return token;
  }

  async fetchProfileInformations(accessToken: string): Promise<FortyTwoProfile> {
    try {
      const response = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });

      const profile = response.data;

      return {
        login: profile.login,
        email: profile.email,
        imageUrl: profile.image.versions.medium,
        displayName: profile.login,
        firstName: profile.first_name,
        lastName: profile.last_name,
      };
    } catch (error) {
      throw new Error('Unable to fetch profile informations');
    }
  }

  async test(user: User): Promise<string | undefined> {
    return await this.userService.testGetFirstName(user);
  }
}
