import { Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { HttpExceptionTransformationFilter } from '@/utils/ws-http-exception.filter';

import { WSAuthMiddleware } from '../auth/ws/ws.middleware';
import { WsJwtGuard } from '../auth/ws/ws-jwt.guard';
import { UserService } from '../user';
import { ChannelsService } from './channels.service';
import {
  BanUserDTO,
  BlockUserDTO,
  CreateChannelDTO,
  DemoteUserDTO,
  JoinChannelDTO,
  KickUserDTO,
  LeaveChannelDTO,
  MessageHistoryDTO,
  MuteUserDTO,
  PromoteUserDTO,
  SendDmDTO,
  SendMessageDTO,
  UpdateChannelDTO,
  UserListInChannelDTO,
} from './chat.dto';
import { ChatEvent } from './chat.events';

@UseGuards(WsJwtGuard)
@UsePipes(new ValidationPipe())
@WebSocketGateway({ namespace: 'chat' })
@UseFilters(HttpExceptionTransformationFilter)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private io: Server;
  private logger: Logger = new Logger(ChatGateway.name);
  private socketsID = new Map<string, Socket[]>();

  constructor(
    private jwtService: JwtService,
    private channelsService: ChannelsService,
    private userService: UserService,
  ) {}

  afterInit(server: Server) {
    const authMiddleware = WSAuthMiddleware(this.jwtService, this.userService);
    server.use(authMiddleware);
  }

  async handleConnection(socket: Socket) {
    this.logger.log('Client connected: ' + socket.id);

    const login = socket.data.user.login;
    const existingSockets = this.socketsID.get(login) || [];
    existingSockets.push(socket);
    this.socketsID.set(login, existingSockets);

    const channels = await this.channelsService.getJoinedChannels(socket.data.user);
    const channelsName = channels.map((c) => c.name);
    socket.join(channelsName);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log('Client disconnected: ' + socket.id);

    const login = socket.data.user.login;
    const existingSockets = this.socketsID.get(login) || [];
    const updatedSockets = existingSockets.filter((s) => s.id !== socket.id);

    if (updatedSockets.length > 0) {
      this.socketsID.set(login, updatedSockets);
    } else {
      // If there are no more sockets for the user, remove the entry from the map
      this.socketsID.delete(login);
    }
  }

  @SubscribeMessage(ChatEvent.Create)
  async onCreateChannel(
    @MessageBody() channel: CreateChannelDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const data = await this.channelsService.createChannel(channel, client.data.user);
    client.join(channel.name);
    return { event: 'youJoined', data: data };
  }

  @SubscribeMessage(ChatEvent.Join)
  async onJoinChannel(@MessageBody() channel: JoinChannelDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.joinChannel(channel, client.data.user);
    this.io.to(channel.name).emit(ChatEvent.Join, data.toChannel);
    client.join(channel.name);
    return { event: 'youJoined', data: data.toClient };
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

  @SubscribeMessage(ChatEvent.Block)
  async onBlockUser(@MessageBody() toBlock: BlockUserDTO, @ConnectedSocket() client: Socket) {
    const user = await this.userService.blockUser(toBlock.login, client.data.user);
    return user.blocked;
  }

  @SubscribeMessage(ChatEvent.Unblock)
  async onUnblockUser(@MessageBody() toUnblock: BlockUserDTO, @ConnectedSocket() client: Socket) {
    const user = await this.userService.unblockUser(toUnblock.login, client.data.user);
    return user.blocked;
  }

  @SubscribeMessage(ChatEvent.BlockedUsersList)
  async onBlockedUsersList(@ConnectedSocket() client: Socket) {
    return await this.userService.getBlockedList(client.data.user);
  }

  @SubscribeMessage(ChatEvent.Promote)
  async onPromoteUser(@MessageBody() promotion: PromoteUserDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.promoteUser(promotion, client.data.user);
    this.io.to(promotion.channel).emit(ChatEvent.Promote, data);
  }

  @SubscribeMessage(ChatEvent.Demote)
  async onDemoteUser(@MessageBody() demotion: DemoteUserDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.demoteUser(demotion, client.data.user);
    this.io.to(demotion.channel).emit(ChatEvent.Demote, data);
  }

  @SubscribeMessage(ChatEvent.Kick)
  async onKickUser(@MessageBody() kick: KickUserDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.kickUser(kick, client.data.user);

    const sockets = this.socketsID.get(kick.login) || [];
    for (const socket of sockets) {
      socket.leave(kick.channel);
      socket.emit('youLeft', data);
    }

    this.io.to(kick.channel).emit(ChatEvent.Leave, data);
  }

  @SubscribeMessage(ChatEvent.Ban)
  async onBanUser(@MessageBody() ban: BanUserDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.banUser(ban, client.data.user);

    const sockets = this.socketsID.get(ban.login) || [];
    for (const socket of sockets) {
      socket.leave(ban.channel);
      socket.emit('youLeft', data);
    }

    this.io.to(ban.channel).emit(ChatEvent.Leave, data);
  }

  @SubscribeMessage(ChatEvent.Mute)
  async onMuteUser(@MessageBody() mute: MuteUserDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.muteUser(mute, client.data.user);
    this.io.to(mute.channel).emit(ChatEvent.Mute, data);
  }

  @SubscribeMessage(ChatEvent.DirectMessage)
  async onDirectMessageUser(@MessageBody() dm: SendDmDTO, @ConnectedSocket() client: Socket) {
    const data = await this.channelsService.sendDM(dm, client.data.user);

    const sockets = this.socketsID.get(dm.login) || [];
    for (const socket of sockets) {
      this.io.to(socket.id).emit(ChatEvent.DirectMessage, data);
    }

    client.emit(ChatEvent.DirectMessage, data);
  }
}
