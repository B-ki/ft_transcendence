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
import { UserService } from '../user';
import { ChannelsService } from './channels.service';
import { CreateChannelDTO, JoinChannelDTO } from './chat.dto';
import { ChatEvent } from './chat.state';

@UsePipes(new ValidationPipe())
@WebSocketGateway({ namespace: 'chat' })
@UseFilters(BadRequestTransformationFilter)
@UseGuards(WsJwtGuard)
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  private io: Server;
  private logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private jwtService: JwtService,
    private channelsService: ChannelsService,
    private userService: UserService,
  ) {}

  afterInit(server: Server) {
    const authMiddleware = WSAuthMiddleware(this.jwtService, this.userService);
    server.use(authMiddleware);

    this.io.on('connection', (socket) => {
      this.logger.log('Client connected: ' + socket.id);
    });

    setInterval(() => this.io.emit('message', 'hello'), 2000);
  }

  @SubscribeMessage(ChatEvent.Create)
  async onCreateChannel(
    @MessageBody() channel: CreateChannelDTO,
    @ConnectedSocket() client: Socket,
  ) {
    await this.channelsService.createChannel(channel, client.data.user);
    return { event: 'joinedChannel', data: channel.name };
  }

  @SubscribeMessage(ChatEvent.Join)
  async onJoinChannel(@MessageBody() channel: JoinChannelDTO, @ConnectedSocket() client: Socket) {
    await this.channelsService.joinChannel(channel, client.data.user);
    //client.join(channel.channel);
  }

  @SubscribeMessage(ChatEvent.Message)
  onMessage(@MessageBody() message: string): WsResponse<string> {
    return { event: ChatEvent.Message, data: 'You sent: ' + message };
  }
}
