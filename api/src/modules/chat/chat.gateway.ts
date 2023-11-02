import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { BadRequestTransformationFilter } from '@/utils/bad-request-exception.filter';

import { WSAuthMiddleware } from '../auth/ws/ws.middleware';
import { WsJwtGuard } from '../auth/ws/ws-jwt.guard';
import { UserService } from '../user';
import { ChannelsService } from './channels.service';
import {
  CreateChannelDTO,
  JoinChannelDTO,
  LeaveChannelDTO,
  MessageHistoryDTO,
  SendMessageDTO,
  UpdateChannelDTO,
  UserListInChannelDTO,
} from './chat.dto';
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

    this.io.on('connection', async (socket) => {
      this.logger.log('Client connected: ' + socket.id);

      const channels = await this.channelsService.getJoinedChannels(socket.data.user);
      const channelsName = channels.map((c) => c.name);
      socket.join(channelsName);
    });
  }

  @SubscribeMessage(ChatEvent.Create)
  async onCreateChannel(
    @MessageBody() channel: CreateChannelDTO,
    @ConnectedSocket() client: Socket,
  ) {
    await this.channelsService.createChannel(channel, client.data.user);
    client.join(channel.name);
    return { event: 'youJoined', data: channel.name };
  }

  @SubscribeMessage(ChatEvent.Join)
  async onJoinChannel(@MessageBody() channel: JoinChannelDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.joinChannel(channel, client.data.user);
    this.io.to(channel.name).emit(ChatEvent.Join, data);
    client.join(channel.name);
    return { event: 'youJoined', data: channel.name };
  }

  @SubscribeMessage(ChatEvent.Leave)
  async onLeaveChannel(@MessageBody() channel: LeaveChannelDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.leaveChannel(channel, client.data.user);
    client.leave(channel.name);
    this.io.to(channel.name).emit(ChatEvent.Leave, data);
    return { event: 'youLeft', data: data };
  }

  @SubscribeMessage(ChatEvent.Message)
  async onMessage(@MessageBody() messageDTO: SendMessageDTO, @ConnectedSocket() client: Socket) {
    const message = await this.channelsService.sendMessage(messageDTO, client.data.user);
    this.io.to(messageDTO.channel).emit(ChatEvent.Message, message);
  }

  @SubscribeMessage(ChatEvent.MessageHistory)
  async onMessageHistory(@MessageBody() dto: MessageHistoryDTO, @ConnectedSocket() client: Socket) {
    return await this.channelsService.getMessageHistory(dto, client.data.user);
  }

  @SubscribeMessage(ChatEvent.UpdateChannel)
  async onUpdateChannel(
    @MessageBody() updateData: UpdateChannelDTO,
    @ConnectedSocket() client: Socket,
  ) {
    await this.channelsService.updateChannel(updateData, client.data.user);
    this.io.to(updateData.name).emit(ChatEvent.UpdateChannel, { type: updateData.type });
  }

  @SubscribeMessage(ChatEvent.UserList)
  async onUserList(@MessageBody() dto: UserListInChannelDTO, @ConnectedSocket() client: Socket) {
    return await this.channelsService.getUserListInChannel(dto, client.data.user);
  }

  @SubscribeMessage(ChatEvent.ChannelList)
  async onChannelList() {
    return await this.channelsService.getChannelList();
  }

  @SubscribeMessage(ChatEvent.JoinedChannels)
  async onGetJoinedChannels(@ConnectedSocket() client: Socket) {
    return await this.channelsService.getJoinedChannels(client.data.user);
  }
}
