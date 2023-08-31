import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async authenticateOrCreateUserFrom42(profile): Promise<void> {
 // https://github.com/pandark/passport-42/blob/master/lib/strategy.js
    const { username } = profile.id;

    // Get the information required from the profile obtained through passport42
    // Use it to either create the User or just Authenticate
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { username } = authCredentialsDto;
    const payload: JwtPayload = { username };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }
}
