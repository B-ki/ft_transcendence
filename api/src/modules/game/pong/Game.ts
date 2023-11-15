import '@pixi/math-extras';

import * as PIXI from 'pixi.js';
import { Socket } from 'socket.io';

const w_screen: number = 840;
const h_screen: number = 460;

export class Player {
  socket: Socket;
  opponent: Player | null = null;
  score: number = 0;
  rect: PIXI.Rectangle = new PIXI.Rectangle();

  constructor(socket: Socket) {
    this.socket = socket;
  }
}

export class Game {
  sprite: PIXI.Rectangle = new PIXI.Rectangle();
  pick1: PIXI.Rectangle = new PIXI.Rectangle();
  pick2: PIXI.Rectangle = new PIXI.Rectangle();
  speed: number = 0.5;
  direction: PIXI.Point = new PIXI.Point();
  player1: Player;
  player2: Player;
  needEmit: boolean = true;
  onFire: boolean = false;
  elapsedTime: number = 0;
  started: boolean = false;

  constructor(x: number, y: number, rad: number, p1: Player, p2: Player, bonus: boolean) {
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.width = rad * 2;
    this.sprite.height = rad * 2;

    this.pick1.width = rad * 2;
    this.pick1.height = rad * 2;
    this.pick1.x = 110;

    this.pick2.width = rad * 2;
    this.pick2.height = rad * 2;
    this.pick2.x = w_screen - 110 - this.pick2.width;

    this.direction.set(1 + Math.random(), 1 + Math.random());
    this.direction.normalize(this.direction);

    this.player1 = p1;
    this.player2 = p2;
    this.player1.socket.emit('bounce', this.sprite, this.direction);
    this.player2.socket.emit('bounce', this.sprite, this.direction);

    if (bonus) {
      this.placePickOnLeft();
      this.placePickOnRight();
    } else {
      this.pick1.y = -50;
      this.pick2.y = -50;
      this.pick1.y = -50;
      this.pick2.y = -50;
    }
  }

  setOnFire() {
    if (this.onFire) return;

    this.onFire = true;

    this.player1.socket.emit('fireball');
    this.player2.socket.emit('fireball');
  }

  setOfFire() {
    if (!this.onFire) return;

    this.onFire = false;

    this.player1.socket.emit('classic_ball');
    this.player2.socket.emit('classic_ball');
  }

  isOnFire() {
    return this.onFire;
  }

  scoreP1() {
    this.player1.score++;
    this.player1.socket.emit('y_point');
    this.player2.socket.emit('op_point');
  }

  scoreP2() {
    this.player2.score++;
    this.player1.socket.emit('op_point');
    this.player2.socket.emit('y_point');
  }

  placePickOnLeft() {
    this.pick1.y = Math.random() * (h_screen - this.pick1.height);

    this.player1.socket.emit('l_pick', this.pick1);
    this.player2.socket.emit('r_pick', reverse_position(this.pick1));
  }

  placePickOnRight() {
    this.pick2.y = Math.random() * (h_screen - this.pick2.height);

    this.player1.socket.emit('r_pick', this.pick2);
    this.player2.socket.emit('l_pick', reverse_position(this.pick2));
  }

  bounce(mapRect: PIXI.Rectangle) {
    const ballRect = this.sprite;
    if (ballRect.intersects(this.pick1) && this.direction.x < 0) {
      this.setOnFire();
      this.placePickOnLeft();
    } else if (ballRect.intersects(this.pick2) && this.direction.x > 0) {
      this.setOnFire();
      this.placePickOnRight();
    }
    if (ballRect.x < mapRect.x) {
      //touche left
      if (this.isOnFire()) {
        this.setOfFire();
        this.direction.x = Math.abs(this.direction.x);
        this.needEmit = true;
      } else {
        this.scoreP2();
        this.launchBall();
      }
    } else if (this.sprite.intersects(this.player1.rect)) {
      //touche left (paddle)
      if (this.isOnFire()) {
        this.setOfFire();
        this.scoreP2();
        this.launchBall();
      } else {
        this.direction = this.newDirection(this.player1);
      }
    } else if (ballRect.x + ballRect.width > mapRect.x + mapRect.width) {
      //touch right
      if (this.isOnFire()) {
        this.setOfFire();
        this.direction.x = -Math.abs(this.direction.x);
        this.needEmit = true;
      } else {
        this.scoreP1();
        this.launchBall();
      }
    } else if (this.sprite.intersects(this.player2.rect)) {
      //touch right (paddle)
      if (this.isOnFire()) {
        this.setOfFire();
        this.scoreP1();
        this.launchBall();
      } else {
        this.direction = this.newDirection(this.player2);
        this.direction.x *= -1;
      }
    }
    if (ballRect.y < mapRect.y) {
      //touch top
      this.direction.y = Math.abs(this.direction.y);
      this.needEmit = true;
    } else if (ballRect.y + ballRect.height > mapRect.y + mapRect.height) {
      //touch bottom
      this.direction.y = -Math.abs(this.direction.y);
      this.needEmit = true;
    }
  }

  launchBall() {
    this.sprite.x = w_screen / 2 - this.sprite.width / 2;
    this.sprite.y = h_screen / 2 - this.sprite.height / 2;
    this.needEmit = true;
  }

  newDirection(pad: Player): PIXI.Point {
    const mid_paddle: number = pad.rect.y + pad.rect.height / 2;
    const mid_ball: number = this.sprite.y + this.sprite.height / 2;
    const newDir: PIXI.Point = new PIXI.Point();

    newDir.x = 1;
    newDir.y = (mid_paddle - mid_ball) / -(pad.rect.height / 2 + this.sprite.height / 2);

    newDir.normalize(newDir);

    this.needEmit = true;

    return newDir;
  }

  move(delta: number, mapRect: PIXI.Rectangle) {
    this.elapsedTime += delta;
    if (this.elapsedTime >= 5000 && !this.started) {
      this.player1.socket.emit('start');
      this.player2.socket.emit('start');
      this.started = true;
    } else if (!this.started) {
      this.player1.socket.emit('remaining', 5000 - this.elapsedTime);
      this.player2.socket.emit('remaining', 5000 - this.elapsedTime);
      return;
    }
    this.sprite.x += this.direction.x * delta * this.speed;
    this.sprite.y += this.direction.y * delta * this.speed;
    this.bounce(mapRect);

    if (this.needEmit) {
      const rev_dire: PIXI.Point = this.direction.clone();
      rev_dire.x = -rev_dire.x;

      this.player1.socket.emit('bounce', this.sprite, this.direction);
      this.player2.socket.emit('bounce', reverse_position(this.sprite), rev_dire);

      this.needEmit = false;
    }
  }

  isFinished() {
    if (this.player1.score >= 15) {
      return true;
    } else if (this.player2.score >= 15) {
      return true;
    } else if (this.player1.opponent == null) {
      return true;
    } else if (this.player2.opponent == null) {
      return true;
    }
    return false;
  }
}

function reverse_position(arg: PIXI.Rectangle): PIXI.Rectangle {
  const ret: PIXI.Rectangle = arg.clone();
  const diff: number = w_screen / 2.0 - (ret.x + ret.width / 2.0);
  ret.x += 2 * diff;

  return ret;
}
