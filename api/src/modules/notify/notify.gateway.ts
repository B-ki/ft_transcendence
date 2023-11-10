import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { HttpExceptionTransformationFilter } from '@/utils/ws-http-exception.filter';

import { WSAuthMiddleware } from '../auth/ws/ws.middleware';
import { WsJwtGuard } from '../auth/ws/ws-jwt.guard';
import { FriendService, UserService } from '../user';

@UseGuards(WsJwtGuard)
@UsePipes(new ValidationPipe())
@WebSocketGateway({ namespace: 'notify' })
@UseFilters(HttpExceptionTransformationFilter)
export class NotifyGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private io: Server;
  private logger: Logger = new Logger(NotifyGateway.name);
  private socketsID: Map<string, string> = new Map<string, string>();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private friendService: FriendService,
  ) {}

  afterInit(server: Server) {
    const authMiddleware = WSAuthMiddleware(this.jwtService, this.userService);
    server.use(authMiddleware);
  }

  async handleConnection(socket: Socket) {
    this.logger.log('Client connected: ' + socket.id);
    this.socketsID.set(socket.data.user.login, socket.id);

    const friends = await this.friendService.getFriendList(socket.data.user);
    for (const friend of friends) {
      const socketID = this.socketsID.get(friend.login);
    }
  }

  handleDisconnect(socket: Socket) {
    this.socketsID.delete(socket.data.user.login);
  }
}
