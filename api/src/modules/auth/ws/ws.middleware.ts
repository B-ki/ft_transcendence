import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export type SocketMiddleware = (socket: Socket, next: (err?: Error) => void) => void;

export const WSAuthMiddleware = (jwtService: JwtService): SocketMiddleware => {
  return (client: Socket, next: (err?: Error) => void) => {
    try {
      jwtService.verify(client.handshake.auth.token);
      next();
    } catch (err) {
      next(err);
    }
  };
};
