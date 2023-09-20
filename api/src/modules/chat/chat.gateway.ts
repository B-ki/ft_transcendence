import { Logger, OnModuleInit } from '@nestjs/common';
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
import { ChatEvent } from './chat.state';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnModuleInit, OnGatewayInit {
  @WebSocketServer()
  io: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(private jwtService: JwtService) {}

  onModuleInit() {
    Logger.log('On module init');
    this.io.on('connection', (socket) => {
      this.logger.log('Client connected: ' + socket.id);
    });
  }

  afterInit(server: Server) {
    Logger.log('After init');
    const authMiddleware = WSAuthMiddleware(this.jwtService);
    server.use(authMiddleware);
  }

  @SubscribeMessage(ChatEvent.Message)
  onMessage(@MessageBody() message: string): WsResponse<string> {
    return { event: ChatEvent.Message, data: 'You sent: ' + message };
  }
}
