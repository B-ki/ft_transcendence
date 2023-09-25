import { Logger, OnModuleInit, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WSAuthMiddleware } from '../auth/ws/ws.middleware';
import { WsJwtGuard } from '../auth/ws/ws-jwt.guard';
import { ChatEvent } from './chat.state';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  private io: Server;
  private logger: Logger = new Logger(ChatGateway.name);

  constructor(private jwtService: JwtService) {}

  afterInit(server: Server) {
    const authMiddleware = WSAuthMiddleware(this.jwtService);
    server.use(authMiddleware);

    this.io.on('connection', (socket) => {
      this.logger.log('Client connected: ' + socket.id);
    });

    setInterval(() => this.io.emit('message', 'hello'), 2000);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.Message)
  onMessage(@MessageBody() message: string): WsResponse<string> {
    return { event: ChatEvent.Message, data: 'You sent: ' + message };
  }
}
