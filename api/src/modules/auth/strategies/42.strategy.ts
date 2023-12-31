import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

import { config } from '@/config';

import { CreateUserDto } from '../auth.dto';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: config.app42.id,
      clientSecret: config.app42.secret,
      callbackURL: `http://${config.app.host}:${config.front.port}${config.front.oauthCallback}`,
    });
  }

  async validate(accessToken: string): Promise<CreateUserDto> {
    const profile = await this.authService.fetchProfileInformations(accessToken);
    return profile;
  }
}
