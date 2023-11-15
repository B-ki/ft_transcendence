import * as PIXI from 'pixi.js';
import { Socket } from 'socket.io-client';

import { game } from './config';

export class Paddle {
  sprite: PIXI.Graphics = new PIXI.Graphics();
  speed: number = 0.4;
  keyUP: boolean = false;
  keyDOWN: boolean = false;

  constructor(x: number, w: number, h: number) {
    this.sprite.x = x;
    this.sprite.y = 0;
    this.sprite.beginFill(0x1a49c4);
    this.sprite.drawRoundedRect(0, 0, w, h, 15);
    this.sprite.endFill();
    this.sprite.visible = false;
  }

  move(dist: number, socket: Socket) {
    this.sprite.y += dist * this.speed;
    if (this.sprite.y < 0) this.sprite.y = 0;
    else if (this.sprite.y + this.sprite.height > game.screen.height)
      this.sprite.y = game.screen.height - this.sprite.height;
    socket.emit('Paddle', this.sprite.y);
  }
}

export class Ball {
  sprite: PIXI.Graphics = new PIXI.Graphics();
  speed: number = 0.5;
  direction: PIXI.Point = new PIXI.Point();
  rad: number;

  constructor(x: number, y: number, rad: number) {
    this.rad = rad;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.beginFill(0x03fcf8);
    this.sprite.drawCircle(0, 0, rad);
    this.sprite.endFill();
    this.direction.set(1 + Math.random(), 1 + Math.random());
    this.direction.normalize(this.direction);
    this.sprite.visible = false;
  }

  setOnFire() {
    this.sprite.clear();
    this.sprite.beginFill(0xfc5603);
    this.sprite.drawCircle(0, 0, this.rad);
    this.sprite.endFill();
  }
  setOfFire() {
    this.sprite.clear();
    this.sprite.beginFill(0x03fcf8);
    this.sprite.drawCircle(0, 0, this.rad);
    this.sprite.endFill();
  }

  move(delta: number) {
    this.sprite.x += this.direction.x * delta * this.speed;
    this.sprite.y += this.direction.y * delta * this.speed;
  }
}
