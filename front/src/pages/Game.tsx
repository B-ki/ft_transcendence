import '@pixi/math-extras';

import * as PIXI from 'pixi.js';
import type { FC } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import { Button } from '@/components/Button';

import { Ball, Paddle } from './pong/BallPaddle';
import { game } from './pong/config';
import { GameEvent } from './pong/game.events';
import {
  bounceBall,
  buttonScreen,
  createPickable,
  createText,
  gameScreen,
  movePickable,
  resize_game,
  updateScore,
} from './pong/utils';

interface Props {}

export const Pong: FC<Props> = () => {
  console.log(GameEvent.BonusQueue);
  const socket = io('ws://localhost:3000/pong', {
    auth: {
      token: localStorage.getItem('token') as string,
    },
  });

  const app = new PIXI.Application<HTMLCanvasElement>({
    width: game.screen.width,
    height: game.screen.height,
    backgroundColor: 0x171717,
    antialias: true,
  });

  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.left = '50%';
  app.renderer.view.style.top = '50%';
  app.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
  app.ticker.maxFPS = 60;
  app.view.style.visibility = 'hidden';
  document.body.appendChild(app.view);

  const middleLine = new DashLine(app);

  const ball = new Ball(game.screen.width / 2, game.screen.height / 2, 10);
  app.stage.addChild(ball.sprite);
  socket.on(GameEvent.Bounce, (arg: PIXI.Rectangle, dir: PIXI.Point) => bounceBall(arg, dir, ball));
  socket.on(GameEvent.ClassicBall, () => ball.setOfFire());
  socket.on(GameEvent.Fireball, () => ball.setOnFire());

  const pad1 = new Paddle(-game.paddle.width / 2, game.paddle.width, game.paddle.height);
  const pad2 = new Paddle(
    game.screen.width - game.paddle.width / 2,
    game.paddle.width,
    game.paddle.height,
  );
  socket.on(GameEvent.Paddle, (arg: number) => (pad2.sprite.y = arg));

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

  app.stage.addChild(pad1.sprite);
  app.stage.addChild(pad2.sprite);

  let scorePlayer1 = 0;
  let scorePlayer2 = 0;

  socket.on(GameEvent.YourPoint, () => (scorePlayer1 = updateScore(scorePlayer1, p1Score)));
  socket.on(GameEvent.OpponentPoint, () => (scorePlayer2 = updateScore(scorePlayer2, p2Score)));

  const pick1 = createPickable(app);
  const pick2 = createPickable(app);

  socket.on(GameEvent.LeftPick, (arg: PIXI.Rectangle) => movePickable(arg, pick1));
  socket.on(GameEvent.RightPick, (arg: PIXI.Rectangle) => movePickable(arg, pick2));

  const countdownText = createText(5, 60, 0xaeb8b1, app);
  countdownText.anchor.set(0.5, 0.5);
  countdownText.x = app.renderer.width * 0.5;
  countdownText.y = app.renderer.height * 0.5;

  let remainingTime: number = 5000;

  socket.on(GameEvent.Remaining, (remaining: number) => (remainingTime = remaining));
  socket.on(GameEvent.Countdown, () => {
    remainingTime = 5000;
    countdownText.text = (remainingTime / 1000.0).toFixed(1);
    screenManager.countdownScreen();
  });
  app.ticker.add(() => {
    if (remainingTime > 0) {
      remainingTime -= app.ticker.deltaMS;
      countdownText.text = (remainingTime / 1000.0).toFixed(1);
      if (remainingTime <= 0) {
        remainingTime = 0;
        countdownText.visible = false;
      }
    }
  });

  const p1Score = createText(scorePlayer1, 24, 0xaeb8b1, app);
  p1Score.anchor.set(1, 0);
  p1Score.x = game.screen.width / 2 - 50;
  p1Score.y = 0;

  const p2Score = createText(scorePlayer2, 24, 0xaeb8b1, app);
  p2Score.x = game.screen.width / 2 + 50;
  p2Score.y = 0;

  const loadingText = createText('Waiting for an opponent', 44, 0xaeb8b1, app);
  loadingText.anchor.set(0.5, 0.5);
  loadingText.x = game.screen.width / 2;
  loadingText.y = game.screen.height / 2;

  const endingText = createText('End', 84, 0xaeb8b1, app);
  endingText.anchor.set(0.5, 0.5);
  endingText.x = game.screen.width / 2;
  endingText.y = game.screen.height / 2;

  socket.on(GameEvent.Victory, () => {
    endingText.text = 'Victory';
    endingText.style.fill = 0x5ab555;
    screenManager.endScreen();
  });

  socket.on(GameEvent.Defeat, () => {
    endingText.text = 'Defeat';
    endingText.style.fill = 0xb52828;
    screenManager.endScreen();
  });

  app.ticker.add(() => {
    ball.move(app.ticker.deltaMS);
    if (pad1.keyUP) pad1.move(-app.ticker.deltaMS, socket);
    if (pad1.keyDOWN) pad1.move(app.ticker.deltaMS, socket);
  });

  const buttonQuit = new TextButton('Quit', game.screen.width / 2, game.screen.height * 0.8, app);
  const buttonLeave = new TextButton('Leave', game.screen.width / 2, game.screen.height * 0.8, app);

  const screenManager = new ScreenManager(
    ball.sprite,
    pad1.sprite,
    pad2.sprite,
    pick1,
    pick2,
    middleLine,
    countdownText,
    p1Score,
    p2Score,
    loadingText,
    endingText,
    buttonQuit.graphics,
    buttonQuit.text,
    buttonLeave.graphics,
    buttonLeave.text,
  );

  buttonQuit.onClick(() => buttonScreen(app, screenManager));
  buttonLeave.onClick(() => socket.emit(GameEvent.LeaveQueue));
  socket.on(GameEvent.LeaveQueue, () => buttonScreen(app, screenManager));

  socket.on(GameEvent.Start, () => screenManager.playScreen());

  function launchGame(bonus: boolean) {
    window.onresize = () => resize_game(app);
    screenManager.setMode(bonus);
    if (bonus) {
      socket.emit(GameEvent.BonusQueue);
    } else {
      socket.emit(GameEvent.ClassicQueue);
    }

    pad1.sprite.y = 0;
    pad2.sprite.y = 0;
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    p1Score.text = scorePlayer1;
    p2Score.text = scorePlayer2;

    gameScreen(app);
    screenManager.queueScreen();
    resize_game(app);
  }

  useEffect(() => {
    return () => {
      if (app) app.destroy(true, { children: true, texture: true, baseTexture: true });
      socket.disconnect();
    };
  }, []);
  return (
    <div className="mt-10 flex h-2/3 w-screen items-center justify-center gap-8">
      <Button id="ClassicQueue" type="primary" size="xlarge" onClick={() => launchGame(false)}>
        Classic Game
      </Button>
      <Button id="BonusQueue" type="primary" size="xlarge" onClick={() => launchGame(true)}>
        Bonus Game
      </Button>
    </div>
  );
};

import { Navbar } from '@/components/Navbar';

import { DashLine } from './pong/DashLine';
import { ScreenManager } from './pong/ScreenManager';
import { TextButton } from './pong/SwitchButton';

function Game() {
  return (
    <div>
      <Navbar />
      <Pong />
    </div>
  );
}

export default Game;
