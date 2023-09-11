import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenError } from 'passport-oauth2';

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
  override handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      if (err instanceof TokenError) {
        throw new UnauthorizedException(err.message);
      } else {
        throw err;
      }
    }

    return user;
  }
}
