import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { HttpExceptionTransformationFilter } from '@/utils/ws-http-exception.filter';

import { WSAuthMiddleware } from '../auth/ws/ws.middleware';
import { WsJwtGuard } from '../auth/ws/ws-jwt.guard';
import { UserService } from '../user';
import { NotifyService } from './notify.service';

@UseGuards(WsJwtGuard)
@WebSocketGateway({ namespace: 'notify' })
@UseFilters(HttpExceptionTransformationFilter)
export class NotifyGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger(NotifyGateway.name);
  private sockets = new Map<string, Socket[]>();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private notifyService: NotifyService,
  ) {}

  afterInit(server: Server) {
    const authMiddleware = WSAuthMiddleware(this.jwtService, this.userService);
    server.use(authMiddleware);

    this.notifyService.sockets = this.sockets;
  }

  async handleConnection(socket: Socket) {
    this.logger.log('Client connected: ' + socket.id);

    const login = socket.data.user.login;
    const existingSockets = this.sockets.get(login) || [];
    existingSockets.push(socket);
    this.sockets.set(login, existingSockets);

    setTimeout(async () => {
      await this.notifyService.online(socket.data.user);
    }, 100);
  }

  async handleDisconnect(socket: Socket) {
    this.logger.log('Client disconnected: ' + socket.id);

    const login = socket.data.user.login;
    const existingSockets = this.sockets.get(login) || [];
    const updatedSockets = existingSockets.filter((s) => s.id !== socket.id);

    if (updatedSockets.length > 0) {
      this.sockets.set(login, updatedSockets);
    } else {
      // If there are no more sockets for the user, remove the entry from the map
      // and set the user as offline
      this.sockets.delete(login);

      setTimeout(async () => {
        await this.notifyService.offline(socket.data.user);
      }, 10);
    }
  }
}
