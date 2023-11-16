import { Injectable } from '@nestjs/common';
import * as PIXI from 'pixi.js';
import { Socket } from 'socket.io';

import { config } from '@/config';

import { Game, Player } from './pong/Game';
import { GameEvent } from './pong/game.events';
import { GameService } from './game.service';

@Injectable()
export class PongService {
  private users: Map<string, Player> = new Map<string, Player>();
  private classicQueue: Player[] = [];
  private bonusQueue: Player[] = [];
  private games: Game[] = [];
  private clock: PIXI.Ticker = new PIXI.Ticker();

  constructor(private gameService: GameService) {
    setInterval(() => {
      for (let i = 0; i < this.games.length; i++) {
        this.games[i].move(
          this.clock.deltaMS,
          new PIXI.Rectangle(0, 0, config.game.width, config.game.heigth),
        );
        if (this.games[i].isFinished()) {
          this.games.splice(i, 1);
        }
      }
    }, 1000.0 / 60);
  }

  addNewPlayer(socket: Socket) {
    console.log('Connected : ' + socket.id);
    const tmp: Player = new Player(socket);
    this.users.set(socket.id, tmp);
  }

  removePlayer(socket: Socket) {
    console.log('Disconnected : ' + socket.id);
    const sender = this.users.get(socket.id);
    this.users.delete(socket.id);

    this.classicQueue = this.classicQueue.filter((player) => player != sender);
    this.bonusQueue = this.bonusQueue.filter((player) => player != sender);
    if (sender?.opponent) {
      sender.opponent.opponent = null;
    }
  }

  movePaddle(socket: Socket, newY: number) {
    const sender = this.users.get(socket.id);
    if (sender && sender.opponent) {
      sender.rect.y = newY;
      sender.opponent.socket.emit(GameEvent.Paddle, newY);
    }
  }

  joinClassicQueue(socket: Socket) {
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

  joinBonusQueue(socket: Socket) {
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

  leaveQueue(socket: Socket) {
    const sender = this.users.get(socket.id);

    let length: number = this.classicQueue.length;
    this.classicQueue = this.classicQueue.filter((player) => player != sender);
    if (this.classicQueue.length != length) {
      socket.emit(GameEvent.LeaveQueue);
      return;
    }

    length = this.bonusQueue.length;
    this.bonusQueue = this.bonusQueue.filter((player) => player != sender);
    if (this.bonusQueue.length != length) {
      socket.emit(GameEvent.LeaveQueue);
      return;
    }
  }

  createGame(player1: Player, player2: Player, bonus: boolean): void {
    player1.opponent = player2;
    player2.opponent = player1;

    const game = new Game(
      this.gameService,
      config.game.width / 2,
      config.game.heigth / 2,
      10,
      player1,
      player2,
      bonus,
    );

    player1.rect = new PIXI.Rectangle(-30, 0, 60, 100);
    player2.rect = new PIXI.Rectangle(config.game.width - 30, 0, 60, 100);

    player1.socket.emit(GameEvent.Countdown);
    player2.socket.emit(GameEvent.Countdown);

    this.games.push(game);
  }
}
