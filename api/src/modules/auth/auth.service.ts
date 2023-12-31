import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserStatus } from '@prisma/client';
import axios from 'axios';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

import { config } from '@/config';

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

  async login(profile: CreateUserDto) {
    let isTwoFaEnabled = false;
    try {
      const user = await this.userService.getUnique(profile.login);
      if (user.isTwoFaEnabled == true) isTwoFaEnabled = true;
    } catch (err) {
      if (err instanceof NotFoundException) {
        this.logger.log(`Creating new user ${profile.login}`);
        await this.userService.createUser(profile);
      } else {
        throw err;
      }
    }

    const payload: JwtPayload = {
      login: profile.login,
      isTwoFaEnabled: isTwoFaEnabled,
      isTwoFaAuthenticated: false,
    };
    const token = this.generateJWT(payload);
    this.logger.log(`${profile.login} logged in`);

    return { token, isTwoFaEnabled };
  }

  async loginWithTwoFa(code: string, user: User) {
    const isCodeValid = this.isTwoFactorAuthCodeValid(code, user);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong 2FA code');
    }

    const payload: JwtPayload = {
      login: user.login,
      isTwoFaEnabled: true,
      isTwoFaAuthenticated: true,
    };

    const token = this.generateJWT(payload);
    this.logger.log(`${user.login} logged in with 2FA`);

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
        imagePath: '',
        intraImageURL: profile.image.versions.medium,
        displayName: displayName,
        description: 'No description atm.',
        status: UserStatus.OFFLINE,
        bannerPath: '',
      };
    } catch (error) {
      throw new Error('Unable to fetch profile informations');
    }
  }

  async generateTwoFactorAuthSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.login, config.twofa.name, secret);
    await this.userService.setTwoFaSecret(secret, user);
    return otpAuthUrl;
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  async getQrCodeDataURL(user: User) {
    if (!user.twoFactorAuthSecret) {
      throw new Error('Cant generate a QrCode for 2FA without secret');
    }
    const otpAuthUrl = authenticator.keyuri(
      user.login,
      config.twofa.name,
      user.twoFactorAuthSecret!,
    );
    return toDataURL(otpAuthUrl);
  }

  async turnOnTwoFA(user: User) {
    const otpAuthUrl = await this.generateTwoFactorAuthSecret(user);
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
}
