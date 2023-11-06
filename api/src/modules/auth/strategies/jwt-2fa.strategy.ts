import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '@/config';

import { UserService } from '../../user';
import { JwtPayload2FA } from '../auth.dto';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private userService: UserService) {
    super({
      secretOrKey: config.jwt.secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload2FA): Promise<User | null> {
    const user: User = await this.userService.getUnique(payload.login);
    if (!user.isTwoFaEnabled) return user;
    if (payload.isTwoFactorAuthenticated) return user;
    return null;
  }
}
