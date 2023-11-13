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
  private sockets: Map<string, Socket> = new Map<string, Socket>();

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
    this.sockets.set(socket.data.user.login, socket);

    await this.notifyService.online(socket.data.user);
  }

  async handleDisconnect(socket: Socket) {
    await this.notifyService.offline(socket.data.user);

    this.sockets.delete(socket.data.user.login);
  }
}
