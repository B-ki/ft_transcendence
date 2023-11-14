import '@pixi/math-extras';

import * as PIXI from 'pixi.js';
import type { FC } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { Button } from '@/components/Button';

import { Ball, Paddle } from './pong/BallPaddle';

interface Props {}

export const w_screen: number = 840;
export const max_w_screen: number = 1260;
export const min_screen_w: number = 500;
export const h_screen: number = 460;
export const max_h_screen: number = 690;

export const Pong: FC<Props> = () => {
  let app: PIXI.Application<HTMLCanvasElement>;

  const socket = io('ws://localhost:3000/pong', {
    auth: {
      token: localStorage.getItem('token') as string,
    },
  });

  function game(bonus: boolean) {
    if (bonus) socket.emit('BonusQueue');
    else socket.emit('ClassicQueue');
    document.getElementById('ClassicQueue').style.visibility = 'hidden';
    document.getElementById('BonusQueue').style.visibility = 'hidden';
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;

    app = new PIXI.Application<HTMLCanvasElement>({
      width: w_screen,
      height: h_screen,
      backgroundColor: 0x171717,
      antialias: true,
    });
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.left = '50%';
    app.renderer.view.style.top = '50%';
    app.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';

    for (let i: number = 0; i < 50; i++) {
      const dash: PIXI.Graphics = new PIXI.Graphics();
      dash.beginFill(0xaeb8b1);
      dash.drawRoundedRect(w_screen / 2 - 1, i * 30, 2, 15, 3);
      dash.endFill();
      app.stage.addChild(dash);
    }

    function resize_game() {
      const real_window_h = window.innerHeight - 64; // remove navbar height
      if (
        window.innerWidth >= max_w_screen &&
        real_window_h >= max_h_screen &&
        app.renderer.width == max_w_screen &&
        app.renderer.height == max_h_screen
      )
        return;
      let coeff_w: number = window.innerWidth / app.renderer.width;
      let coeff_h: number = real_window_h / app.renderer.height;
      if (coeff_w < coeff_h) {
        coeff_w =
          app.renderer.width * coeff_w < max_w_screen ? coeff_w : max_w_screen / app.renderer.width;
        coeff_w =
          app.renderer.width * coeff_w > min_screen_w ? coeff_w : min_screen_w / app.renderer.width;
        app.stage.width *= coeff_w;
        app.stage.height *= coeff_w;
        app.renderer.resize(app.renderer.width * coeff_w, app.renderer.height * coeff_w);
      } else {
        coeff_h =
          app.renderer.height * coeff_h < max_h_screen
            ? coeff_h
            : max_h_screen / app.renderer.height;
        coeff_h =
          app.renderer.width * coeff_h > min_screen_w ? coeff_h : min_screen_w / app.renderer.width;
        app.stage.width *= coeff_h;
        app.stage.height *= coeff_h;
        app.renderer.resize(app.renderer.width * coeff_h, app.renderer.height * coeff_h);
      }
    }

    window.onresize = resize_game;
    app.ticker.maxFPS = 60;
    document.body.appendChild(app.view);

    const pad1: Paddle = new Paddle(-30, 60, 100);
    app.stage.addChild(pad1.sprite);
    const pad2: Paddle = new Paddle(w_screen - 30, 60, 100);
    app.stage.addChild(pad2.sprite);

    const pick1: PIXI.Graphics = new PIXI.Graphics();
    const pick2: PIXI.Graphics = new PIXI.Graphics();

    pick1.beginFill(0xfc5603);
    pick1.drawCircle(0, 0, 10);
    pick1.endFill();

    pick2.beginFill(0xfc5603);
    pick2.drawCircle(0, 0, 10);
    pick2.endFill();

    app.stage.addChild(pick1);
    app.stage.addChild(pick2);

    socket.on('paddle', (arg: number) => {
      pad2.sprite.y = arg;
    });

    socket.on('start', () => {
      hideLoadingScreen(pad1, pad2, ball, pick1, pick2, loading_text, bonus);
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

    let remainingTime: number = 5000;

    const countdownText: PIXI.Text = new PIXI.Text(5, {
      fontFamily: 'Arial',
      fontSize: 50,
      fill: 0xaeb8b1,
      align: 'center',
    });
    countdownText.anchor.set(0.5, 0.5);
    countdownText.x = app.renderer.width * 0.25;
    countdownText.y = app.renderer.height * 0.5;

    socket.on('countdown', () => {
      app.stage.addChild(countdownText);
      app.ticker.add(() => {
        if (remainingTime > 0) {
          remainingTime -= app.ticker.deltaMS;
          if (remainingTime <= 0) {
            remainingTime = 0;
            countdownText.visible = false;
          }
          countdownText.text = (remainingTime / 1000.0).toFixed(1);
        }
      });
    });

    socket.on('remaining', (remaining: number) => {
      remainingTime = remaining;
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
      fill: 0xaeb8b1,
      align: 'center',
    });

    score_1_text.anchor.set(1, 0);

    const score_2_text: PIXI.Text = new PIXI.Text(scorePlayer2, {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xaeb8b1,
      align: 'center',
    });

    const loading_text: PIXI.Text = new PIXI.Text('Waiting...', {
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xaeb8b1,
      align: 'center',
    });

    loading_text.anchor.set(0.5, 0.5);
    loading_text.x = app.renderer.width * 0.75;
    loading_text.y = app.renderer.height * 0.5;

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

    score_2_text.x = w_screen / 2 + 50;
    score_2_text.y = 0;

    app.stage.addChild(score_1_text);
    app.stage.addChild(score_2_text);
    app.stage.addChild(loading_text);

    window.addEventListener('blur', () => {
      pad1.keyUP = false;
      pad1.keyDOWN = false;
    });

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
      if (pad1.keyUP) pad1.move(-app.ticker.deltaMS, socket);
      if (pad1.keyDOWN) pad1.move(app.ticker.deltaMS, socket);
    });
    resize_game();
    showLoadingScreen(pad1, pad2, ball, pick1, pick2, loading_text);
  }

  function showLoadingScreen(
    pad1: Paddle,
    pad2: Paddle,
    ball: Ball,
    pick1: PIXI.Graphics,
    pick2: PIXI.Graphics,
    loadingText: PIXI.Text,
  ) {
    pad1.sprite.visible = false;
    pad2.sprite.visible = false;
    ball.sprite.visible = false;
    pick1.visible = false;
    pick2.visible = false;
    loadingText.visible = true;
  }
  function hideLoadingScreen(
    pad1: Paddle,
    pad2: Paddle,
    ball: Ball,
    pick1: PIXI.Graphics,
    pick2: PIXI.Graphics,
    loadingText: PIXI.Text,
    bonus: boolean,
  ) {
    pad1.sprite.visible = true;
    pad2.sprite.visible = true;
    ball.sprite.visible = true;
    if (bonus) {
      pick1.visible = true;
      pick2.visible = true;
    }
    loadingText.visible = false;
  }

  useEffect(() => {
    return () => {
      if (app) app.destroy(true, { children: true, texture: true, baseTexture: true });
      socket.disconnect();
    };
  }, []);
  return (
    <div className="mt-10 flex h-2/3 w-screen items-center justify-center gap-8">
      <Button id="ClassicQueue" type="primary" size="xlarge" onClick={() => game(false)}>
        Classic Game
      </Button>
      <Button id="BonusQueue" type="primary" size="xlarge" onClick={() => game(true)}>
        Bonus Game
      </Button>
    </div>
  );
};

import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';

function Game() {
  const { logout } = useAuth();
  return (
    <div>
      <Navbar />
      <Pong />
    </div>
  );
}

export default Game;
