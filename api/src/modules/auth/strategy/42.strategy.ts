import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { config } from '@/config';

import { FortyTwoProfile } from '../auth.interface';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-oauth2';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: config.app42.id,
      clientSecret: config.app42.secret,
      callbackURL: 'http://localhost:8081/api/auth/42/callback',
    });
  }

  validate(accessToken: string, refreshToken: string, profile: FortyTwoProfile): FortyTwoProfile {
    return profile;
  }
}
