import '@pixi/math-extras';

import { ParseFloatPipe, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { HttpExceptionTransformationFilter } from '@/utils/ws-http-exception.filter';

import { WSAuthMiddleware } from '../auth/ws/ws.middleware';
import { UserService } from '../user';
import { GameEvent } from './pong/game.events';
import { PongService } from './pong.service';

@WebSocketGateway({
  namespace: 'pong',
  cors: { origin: 'http://localhost:8080' },
})
@UseFilters(HttpExceptionTransformationFilter)
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private pongService: PongService,
  ) {}

  afterInit(server: Server) {
    const authMiddleware = WSAuthMiddleware(this.jwtService, this.userService);
    server.use(authMiddleware);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.pongService.addNewPlayer(socket);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.pongService.removePlayer(socket);
  }

  @SubscribeMessage(GameEvent.Paddle)
  paddleMove(@ConnectedSocket() socket: Socket, @MessageBody(new ParseFloatPipe()) body: number) {
    this.pongService.movePaddle(socket, body);
  }

  @SubscribeMessage(GameEvent.ClassicQueue)
  joinClassicQueue(@ConnectedSocket() socket: Socket) {
    this.pongService.joinClassicQueue(socket);
  }

  @SubscribeMessage(GameEvent.BonusQueue)
  joinBonusQueue(@ConnectedSocket() socket: Socket) {
    this.pongService.joinBonusQueue(socket);
  }
}
