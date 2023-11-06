import { Button } from '@/components/Button';
import '@pixi/math-extras';

import * as PIXI from 'pixi.js';
import type { FC } from 'react';
import { io } from 'socket.io-client';
import { Stage, Container, Sprite, Text, Graphics } from '@pixi/react';
import { useEffect, useState, useCallback } from 'react';

interface Props {}

export const Pong: FC<Props> = () => {
  const w_screen: number = 840;
  const min_screen_w: number = 500;
  const h_screen: number = 460;

  const socket = io('ws://localhost:3001/pong');

  class Paddle {
    sprite: PIXI.Graphics = new PIXI.Graphics();
    speed: number = 0.4;
    keyUP: boolean = false;
    keyDOWN: boolean = false;

    constructor(x: number, w: number, h: number) {
      this.sprite.x = x;
      this.sprite.y = 0;
      this.sprite.beginFill(0x0000ff);
      this.sprite.drawRect(0, 0, w, h);
      this.sprite.endFill();
    }

    move(dist: number) {
      this.sprite.y += dist * this.speed;
      if (this.sprite.y < 0) this.sprite.y = 0;
      else if (this.sprite.y + this.sprite.height > h_screen)
        this.sprite.y = h_screen - this.sprite.height;
      socket.emit('paddle', this.sprite.y);
    }
  }

  class Ball {
    sprite: PIXI.Graphics = new PIXI.Graphics();
    speed: number = 0.5;
    direction: PIXI.Point = new PIXI.Point();
    rad: number;

    constructor(x: number, y: number, rad: number) {
      this.rad = rad;
      this.sprite.x = x;
      this.sprite.y = y;
      this.sprite.beginFill(0xff0000);
      this.sprite.drawCircle(0, 0, rad);
      this.sprite.endFill();
      this.direction.set(1 + Math.random(), 1 + Math.random());
      this.direction.normalize(this.direction);
    }

    setOnFire() {
      this.sprite.clear();
      this.sprite.beginFill(0xffff00);
      this.sprite.drawCircle(0, 0, this.rad);
      this.sprite.endFill();
    }
    setOfFire() {
      this.sprite.clear();
      this.sprite.beginFill(0xff0000);
      this.sprite.drawCircle(0, 0, this.rad);
      this.sprite.endFill();
    }

    move(delta: number) {
      this.sprite.x += this.direction.x * delta * this.speed;
      this.sprite.y += this.direction.y * delta * this.speed;
    }
  }

  let scorePlayer1 = 0;
  let scorePlayer2 = 0;

  const app: PIXI.Application<HTMLCanvasElement> = new PIXI.Application<HTMLCanvasElement>({
    width: w_screen,
    height: h_screen,
  });
  function resize_game() {
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.left = '50%';
    app.renderer.view.style.top = '50%';
    app.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
    if (
      window.innerWidth >= w_screen &&
      window.innerHeight >= h_screen &&
      app.renderer.width == w_screen &&
      app.renderer.height == h_screen
    )
      return;
    let coeff_w: number = window.innerWidth / app.renderer.width;
    let coeff_h: number = window.innerHeight / app.renderer.height;
    if (coeff_w < coeff_h) {
      coeff_w = app.renderer.width * coeff_w < w_screen ? coeff_w : w_screen / app.renderer.width;
      coeff_w =
        app.renderer.width * coeff_w > min_screen_w ? coeff_w : min_screen_w / app.renderer.width;
      app.stage.width *= coeff_w;
      app.stage.height *= coeff_w;
      app.renderer.resize(app.renderer.width * coeff_w, app.renderer.height * coeff_w);
    } else {
      coeff_h = app.renderer.height * coeff_h < h_screen ? coeff_h : h_screen / app.renderer.height;
      coeff_h =
        app.renderer.width * coeff_h > min_screen_w ? coeff_h : min_screen_w / app.renderer.width;
      app.stage.width *= coeff_h;
      app.stage.height *= coeff_h;
      app.renderer.resize(app.renderer.width * coeff_h, app.renderer.height * coeff_h);
    }
  }

  window.onresize = resize_game;
  app.ticker.maxFPS = 60;
  useEffect(() => {
    return () => {
      document.body.removeChild(app.view);
    };
  }, []);
  document.body.appendChild(app.view);

  const pad1: Paddle = new Paddle(-30, 60, 100);
  app.stage.addChild(pad1.sprite);
  const pad2: Paddle = new Paddle(w_screen - 30, 60, 100);
  app.stage.addChild(pad2.sprite);

  const pick1: PIXI.Graphics = new PIXI.Graphics();
  const pick2: PIXI.Graphics = new PIXI.Graphics();

  pick1.beginFill(0xffff00);
  pick1.drawCircle(0, 0, 10);
  pick1.endFill();

  pick2.beginFill(0xffff00);
  pick2.drawCircle(0, 0, 10);
  pick2.endFill();

  app.stage.addChild(pick1);
  app.stage.addChild(pick2);

  socket.on('paddle', (arg: number) => {
    pad2.sprite.y = arg;
  });

  socket.on('l_pick', (arg: PIXI.Rectangle) => {
    pick1.x = arg.x + pick1.width / 2;
    pick1.y = arg.y + pick1.height / 2;
  });

  socket.on('r_pick', (arg: PIXI.Rectangle) => {
    pick2.x = arg.x + pick2.width / 2;
    pick2.y = arg.y + pick2.height / 2;
  });

  socket.on('bounce', (arg: PIXI.Rectangle, dir: PIXI.Point) => {
    ball.sprite.x = arg.x + 10;
    ball.sprite.y = arg.y + 10;
    ball.direction.x = dir.x;
    ball.direction.y = dir.y;
  });

  const ball: Ball = new Ball(w_screen / 2, h_screen / 2, 10);
  app.stage.addChild(ball.sprite);

  socket.on('classic_ball', () => {
    ball.setOfFire();
  });

  socket.on('fireball', () => {
    ball.setOnFire();
  });

  const score_1_text: PIXI.Text = new PIXI.Text(scorePlayer1, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xff1010,
    align: 'center',
  });

  const score_2_text: PIXI.Text = new PIXI.Text(scorePlayer2, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xff1010,
    align: 'center',
  });

  socket.on('y_point', () => {
    scorePlayer1++;
    score_1_text.text = scorePlayer1;
  });

  socket.on('op_point', () => {
    scorePlayer2++;
    score_2_text.text = scorePlayer2;
  });

  score_1_text.x = w_screen / 2 - 50;
  score_1_text.y = 0;

  score_2_text.x = w_screen / 2;
  score_2_text.y = 0;

  app.stage.addChild(score_1_text);
  app.stage.addChild(score_2_text);

  document.addEventListener('keydown', (key: KeyboardEvent) => {
    if (key.key == 'q') pad1.keyUP = true;
    if (key.key == 'a') pad1.keyDOWN = true;
  });

  document.addEventListener('keyup', (key: KeyboardEvent) => {
    if (key.key == 'q') pad1.keyUP = false;
    if (key.key == 'a') pad1.keyDOWN = false;
  });

  app.ticker.add(() => {
    ball.move(app.ticker.deltaMS);
    if (pad1.keyUP) pad1.move(-app.ticker.deltaMS);
    if (pad1.keyDOWN) pad1.move(app.ticker.deltaMS);
  });
  resize_game();

  return <div></div>;
};

import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

function Game() {
  const { logout } = useAuth();
  return (
    <div>
      <Navbar />
      <Pong />
      <div className="mt-10 flex w-screen justify-center gap-8">
        <h1>Profile page</h1>
        <button className="w-fit">Login</button>
        {
          <button className="w-fit" onClick={logout}>
            Logout
          </button>
        }
      </div>
    </div>
  );
}

export default Game;
