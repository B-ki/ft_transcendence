import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    const accessToken = await this.generateJWT(payload);
    console.log('Returning accessToken :', accessToken);

    return accessToken;
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
      this.logger.error(error.response?.data);
      throw new Error('Unable to fetch profile informations');
    }
  }
}
