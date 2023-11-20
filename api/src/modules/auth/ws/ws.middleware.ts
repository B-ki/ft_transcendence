import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

import { UserService } from '@/modules/user';

import { JwtPayload } from '../auth.dto';

export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const WSAuthMiddleware = (
  jwtService: JwtService,
  userService: UserService,
): SocketMiddleware => {
  return async (client: Socket, next: (err?: Error) => void) => {
    try {
      let token = client.handshake.headers.token;
      if (!token) {
        token = client.handshake.auth.token;
      }

      const payload: JwtPayload = jwtService.verify(token as string);
      client.data.user = await userService.getUnique(payload.login);
      next();
    } catch (err) {
      next(err);
    }
  };
};
