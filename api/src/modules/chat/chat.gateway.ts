import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { BadRequestTransformationFilter } from '@/utils/bad-request-exception.filter';

import { WSAuthMiddleware } from '../auth/ws/ws.middleware';
import { WsJwtGuard } from '../auth/ws/ws-jwt.guard';
import { ChannelsService } from './channels.service';
import { JoinChannelDTO } from './chat.dto';
import { ChatEvent } from './chat.state';

@UsePipes(new ValidationPipe())
@WebSocketGateway({ namespace: 'chat' })
@UseFilters(BadRequestTransformationFilter)
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  private io: Server;
  private logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private jwtService: JwtService,
    private channelsService: ChannelsService,
  ) {}

  afterInit(server: Server) {
    const authMiddleware = WSAuthMiddleware(this.jwtService);
    server.use(authMiddleware);

    this.io.on('connection', (socket) => {
      this.logger.log('Client connected: ' + socket.id);
    });

    setInterval(() => this.io.emit('message', 'hello'), 2000);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.Join)
  onJoinChannel(@MessageBody() channel: JoinChannelDTO, @ConnectedSocket() client: Socket): void {
    client.join(channel.channel);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage(ChatEvent.Message)
  onMessage(@MessageBody() message: string): WsResponse<string> {
    return { event: ChatEvent.Message, data: 'You sent: ' + message };
  }
}
