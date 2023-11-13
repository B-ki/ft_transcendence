import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '@prisma/client';
import axios from 'axios';

import { UserService } from '../user';
import { CreateUserDto, JwtPayload } from './auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  generateJWT(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async login(profile: CreateUserDto): Promise<string> {
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

    const payload: JwtPayload = { login: profile.login };
    const token = this.generateJWT(payload);
    this.logger.log(`${profile.login} logged in`);

    return token;
  }

  async fetchProfileInformations(accessToken: string): Promise<CreateUserDto> {
    try {
      const response = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      });

      const profile = response.data;

      let displayName = profile.login;
      while (await this.userService.isDisplayNameInUse(displayName)) {
        displayName += '_';
      }

      return {
        login: profile.login,
        email: profile.email,
        imageUrl: profile.image.versions.medium,
        displayName: displayName,
        firstName: profile.first_name,
        lastName: profile.last_name,
        description: 'No description atm.',
        status: UserStatus.OFFLINE,
        bannerUrl: 'Good banner to place here',
      };
    } catch (error) {
      throw new Error('Unable to fetch profile informations');
    }
  }
}
