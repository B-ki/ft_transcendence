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
import * as PIXI from 'pixi.js';
import { Server, Socket } from 'socket.io';

import { config } from '@/config';
import { HttpExceptionTransformationFilter } from '@/utils/ws-http-exception.filter';

import { WSAuthMiddleware } from '../auth/ws/ws.middleware';
import { UserService } from '../user';
import { Game, Player } from './pong/Game';
import { GameEvent } from './pong/game.events';

const games: Game[] = [];

@WebSocketGateway({
  namespace: 'pong',
  cors: { origin: 'http://localhost:8080' },
})
@UseFilters(HttpExceptionTransformationFilter)
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private users: Map<string, Player> = new Map<string, Player>();
  private classicQueue: Player[] = [];
  private bonusQueue: Player[] = [];
  private clock: PIXI.Ticker = new PIXI.Ticker();

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  afterInit(server: Server) {
    const authMiddleware = WSAuthMiddleware(this.jwtService, this.userService);
    server.use(authMiddleware);

    setInterval(() => {
      for (let i = 0; i < games.length; i++) {
        games[i].move(
          this.clock.deltaMS,
          new PIXI.Rectangle(0, 0, config.game.width, config.game.heigth),
        );
        if (games[i].player1.score >= 45 || games[i].player2.score >= 45) {
          games.splice(i, 1);
        }
      }
    }, 1000.0 / 60);
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    console.log('Connected : ' + socket.id);
    const tmp: Player = new Player(socket);
    this.users.set(socket.id, tmp);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('Disconnected : ' + socket.id);
    const sender = this.users.get(socket.id);
    this.users.delete(socket.id);

    this.classicQueue = this.classicQueue.filter((player) => player == sender);
    this.bonusQueue = this.bonusQueue.filter((player) => player == sender);
  }

  @SubscribeMessage(GameEvent.Paddle)
  paddleMove(@ConnectedSocket() socket: Socket, @MessageBody(new ParseFloatPipe()) body: number) {
    const sender = this.users.get(socket.id);
    if (sender && sender.opponent) {
      sender.rect.y = body;
      sender.opponent.socket.emit(GameEvent.Paddle, body);
    }
  }

  @SubscribeMessage(GameEvent.ClassicQueue)
  joinClassicQueue(@ConnectedSocket() socket: Socket) {
    const sender = this.users.get(socket.id);

    if (sender && this.classicQueue.push(sender) % 2 == 0) {
      console.log('launch a classic pong game');
      this.createGame(
        this.classicQueue[this.classicQueue.length - 1],
        this.classicQueue[this.classicQueue.length - 2],
        false,
      );
      this.classicQueue.splice(this.classicQueue.length - 2, 2);
    }
  }

  @SubscribeMessage(GameEvent.BonusQueue)
  joinBonusQueue(@ConnectedSocket() socket: Socket) {
    const sender = this.users.get(socket.id);

    if (sender && this.bonusQueue.push(sender) % 2 == 0) {
      console.log('launch a bonus pong game');
      this.createGame(
        this.bonusQueue[this.bonusQueue.length - 1],
        this.bonusQueue[this.bonusQueue.length - 2],
        true,
      );
      this.bonusQueue.splice(this.bonusQueue.length - 2, 2);
    }
  }

  createGame(player1: Player, player2: Player, bonus: boolean): void {
    player1.opponent = player2;
    player2.opponent = player1;

    const game = new Game(
      config.game.width / 2,
      config.game.heigth / 2,
      10,
      player1,
      player2,
      bonus,
    );

    game.player1.rect = new PIXI.Rectangle(-30, 0, 60, 100);
    game.player2.rect = new PIXI.Rectangle(config.game.width - 30, 0, 60, 100);

    player1.socket.emit(GameEvent.Countdown);
    player2.socket.emit(GameEvent.Countdown);

    games.push(game);
  }
}
