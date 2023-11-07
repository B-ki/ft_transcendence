import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import axios from 'axios';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

import { config } from '@/config';

import { UserService } from '../user';
import { CreateUserDto, JwtPayload, JwtPayload2FA } from './auth.dto';

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
        isConnected: true,
        bannerUrl: 'Good banner to place here',
      };
    } catch (error) {
      throw new Error('Unable to fetch profile informations');
    }
  }

  async generateTwoFactorAuthSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.email, config.twofa.name, secret);
    await this.userService.setTwoFaSecret(secret, user);
    return { secret, otpAuthUrl };
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async turnOnTwoFA(user: User) {
    const { otpAuthUrl } = await this.generateTwoFactorAuthSecret(user);
    if (!otpAuthUrl) throw new Error('Error generating the QR code');
    return this.generateQrCodeDataURL(otpAuthUrl);
  }

  isTwoFactorAuthCodeValid(twoFACode: string, user: User) {
    if (!user.twoFactorAuthSecret) return false;
    return authenticator.verify({
      token: twoFACode,
      secret: user.twoFactorAuthSecret,
    });
  }

  async loginWithTwoFA(user: User): Promise<string> {
    const payload: JwtPayload2FA = {
      login: user.login,
      isTwoFAEnabled: !!user.isTwoFaEnabled,
      isTwoFactorAuthenticated: true,
    };
    const token = this.generateJWT(payload);
    this.logger.log(`${user.login} logged in`);

    return token;
  }
}
