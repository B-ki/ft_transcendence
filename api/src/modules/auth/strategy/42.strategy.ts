import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

import { config } from '@/config';

import { FortyTwoProfile } from '../auth.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService) {
    super({
      clientID: config.app42.id,
      clientSecret: config.app42.secret,
      callbackURL: 'http://localhost:3000/auth/42/callback',
    });
  }

  validate(accessToken: string, refreshToken: string, profile: FortyTwoProfile): FortyTwoProfile {
    return profile;
  }
}
