import '@pixi/math-extras';

import * as PIXI from 'pixi.js';
import { Component } from 'react';
import { io, Socket } from 'socket.io-client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

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

export class Pong extends Component {
  private socket: Socket;
  private app: PIXI.Application<HTMLCanvasElement>;
  private middleLine: DashLine;
  private ball: Ball;
  private pad1: Paddle;
  private pad2: Paddle;
  private scorePlayer1: number = 0;
  private scorePlayer2: number = 0;
  private pick1: PIXI.Graphics;
  private pick2: PIXI.Graphics;
  private countdownText: PIXI.Text;
  private remainingTime: number = 5000;
  private screenManager: ScreenManager;
  private p1Score: PIXI.Text;
  private p2Score: PIXI.Text;
  private loadingText: PIXI.Text;
  private endingText: PIXI.Text;
  private buttonQuit: TextButton;
  private buttonLeave: TextButton;

  constructor(props: Props) {
    super(props);

    this.socket = io('ws://' + window.location.host + '/pong', {
      auth: {
        token: localStorage.getItem('token') as string,
      },
    });
    this.app = new PIXI.Application<HTMLCanvasElement>({
      width: game.screen.width,
      height: game.screen.height,
      backgroundColor: 0x171717,
      antialias: true,
    });
    this.app.renderer.view.style.position = 'absolute';
    this.app.renderer.view.style.left = '50%';
    this.app.renderer.view.style.top = '50%';
    this.app.renderer.view.style.transform = 'translate3d( -50%, -50%, 0 )';
    this.app.ticker.maxFPS = 60;
    this.app.view.style.visibility = 'hidden';
    document.body.appendChild(this.app.view);

    this.middleLine = new DashLine(this.app);
    this.ball = new Ball(game.screen.width / 2, game.screen.height / 2, 10);
    this.app.stage.addChild(this.ball.sprite);
    this.socket.on(GameEvent.Bounce, (arg: PIXI.Rectangle, dir: PIXI.Point) =>
      bounceBall(arg, dir, this.ball),
    );
    this.socket.on(GameEvent.ClassicBall, () => this.ball.setOfFire());
    this.socket.on(GameEvent.Fireball, () => this.ball.setOnFire());

    this.pad1 = new Paddle(-game.paddle.width / 2, game.paddle.width, game.paddle.height);
    this.pad2 = new Paddle(
      game.screen.width - game.paddle.width / 2,
      game.paddle.width,
      game.paddle.height,
    );
    this.socket.on(GameEvent.Paddle, (arg: number) => (this.pad2.sprite.y = arg));

    window.addEventListener('blur', () => {
      this.pad1.keyUP = false;
      this.pad1.keyDOWN = false;
    });

    document.addEventListener('keydown', (key: KeyboardEvent) => {
      if (key.key == 'q') this.pad1.keyUP = true;
      if (key.key == 'a') this.pad1.keyDOWN = true;
    });

    document.addEventListener('keyup', (key: KeyboardEvent) => {
      if (key.key == 'q') this.pad1.keyUP = false;
      if (key.key == 'a') this.pad1.keyDOWN = false;
    });

    this.app.stage.addChild(this.pad1.sprite);
    this.app.stage.addChild(this.pad2.sprite);

    this.socket.on(
      GameEvent.YourPoint,
      () => (this.scorePlayer1 = updateScore(this.scorePlayer1, this.p1Score)),
    );
    this.socket.on(
      GameEvent.OpponentPoint,
      () => (this.scorePlayer2 = updateScore(this.scorePlayer2, this.p2Score)),
    );

    this.pick1 = createPickable(this.app);
    this.pick2 = createPickable(this.app);

    this.socket.on(GameEvent.LeftPick, (arg: PIXI.Rectangle) => movePickable(arg, this.pick1));
    this.socket.on(GameEvent.RightPick, (arg: PIXI.Rectangle) => movePickable(arg, this.pick2));

    this.countdownText = createText(5, 60, 0xaeb8b1, this.app);
    this.countdownText.anchor.set(0.5, 0.5);
    this.countdownText.x = this.app.renderer.width * 0.5;
    this.countdownText.y = this.app.renderer.height * 0.5;

    this.socket.on(GameEvent.Remaining, (remaining: number) => (this.remainingTime = remaining));
    this.socket.on(GameEvent.Countdown, () => {
      this.remainingTime = 5000;
      this.countdownText.text = (this.remainingTime / 1000.0).toFixed(1);
      this.screenManager.countdownScreen();
    });

    this.app.ticker.add(() => {
      if (this.remainingTime > 0) {
        this.remainingTime -= this.app.ticker.deltaMS;
        this.countdownText.text = (this.remainingTime / 1000.0).toFixed(1);
        if (this.remainingTime <= 0) {
          this.remainingTime = 0;
          this.countdownText.visible = false;
        }
      }
    });

    this.p1Score = createText(this.scorePlayer1, 24, 0xaeb8b1, this.app);
    this.p1Score.anchor.set(1, 0);
    this.p1Score.x = game.screen.width / 2 - 50;
    this.p1Score.y = 0;

    this.p2Score = createText(this.scorePlayer2, 24, 0xaeb8b1, this.app);
    this.p2Score.x = game.screen.width / 2 + 50;
    this.p2Score.y = 0;

    this.loadingText = createText('Waiting for an opponent', 44, 0xaeb8b1, this.app);
    this.loadingText.anchor.set(0.5, 0.5);
    this.loadingText.x = game.screen.width / 2;
    this.loadingText.y = game.screen.height / 2;

    this.endingText = createText('End', 84, 0xaeb8b1, this.app);
    this.endingText.anchor.set(0.5, 0.5);
    this.endingText.x = game.screen.width / 2;
    this.endingText.y = game.screen.height / 2;

    this.socket.on(GameEvent.Victory, () => {
      this.endingText.text = 'Victory';
      this.endingText.style.fill = 0x5ab555;
      this.screenManager.endScreen();
    });

    this.socket.on(GameEvent.Defeat, () => {
      this.endingText.text = 'Defeat';
      this.endingText.style.fill = 0xb52828;
      this.screenManager.endScreen();
    });

    this.app.ticker.add(() => {
      this.ball.move(this.app.ticker.deltaMS);
      if (this.pad1.keyUP) this.pad1.move(-this.app.ticker.deltaMS, this.socket);
      if (this.pad1.keyDOWN) this.pad1.move(this.app.ticker.deltaMS, this.socket);
    });

    this.buttonQuit = new TextButton(
      'Quit',
      game.screen.width / 2,
      game.screen.height * 0.8,
      this.app,
    );
    this.buttonLeave = new TextButton(
      'Leave',
      game.screen.width / 2,
      game.screen.height * 0.8,
      this.app,
    );

    this.buttonQuit.onClick(() => buttonScreen(this.app, this.screenManager));
    this.buttonLeave.onClick(() => this.socket.emit(GameEvent.LeaveQueue));
    this.socket.on(GameEvent.LeaveQueue, () => buttonScreen(this.app, this.screenManager));

    this.socket.on(GameEvent.Start, () => this.screenManager.playScreen());

    this.screenManager = new ScreenManager(
      this.ball.sprite,
      this.pad1.sprite,
      this.pad2.sprite,
      this.pick1,
      this.pick2,
      this.middleLine,
      this.countdownText,
      this.p1Score,
      this.p2Score,
      this.loadingText,
      this.endingText,
      this.buttonQuit.graphics,
      this.buttonQuit.text,
      this.buttonLeave.graphics,
      this.buttonLeave.text,
    );
  }

  launchGame(bonus: boolean) {
    const textInput = document.getElementById('key') as HTMLInputElement;
    window.onresize = () => resize_game(this.app);
    this.screenManager.setMode(bonus);
    if (bonus) {
      this.socket.emit(GameEvent.BonusQueue, textInput.value);
    } else {
      this.socket.emit(GameEvent.ClassicQueue, textInput.value);
    }

    this.pad1.sprite.y = 0;
    this.pad2.sprite.y = 0;
    this.scorePlayer1 = 0;
    this.scorePlayer2 = 0;
    this.p1Score.text = this.scorePlayer1;
    this.p2Score.text = this.scorePlayer2;

    gameScreen(this.app);
    this.screenManager.queueScreen();
    resize_game(this.app);
  }

  componentWillUnmount(): void {
    this.app.destroy(true, { children: false, texture: true, baseTexture: true });
    this.socket.disconnect();
    window.onresize = () => {};
  }

  render() {
    const queryParameters = new URLSearchParams(window.location.search);
    const code = queryParameters.get('code');

    return (
      <div className="mt-10 flex h-2/3 w-screen flex-col items-center justify-center gap-8">
        <Button
          id="ClassicQueue"
          type="primary"
          size="xlarge"
          onClick={() => this.launchGame(false)}
        >
          Classic Game
        </Button>
        <Button id="BonusQueue" type="primary" size="xlarge" onClick={() => this.launchGame(true)}>
          Bonus Game
        </Button>
        <input
          className="rounded-md border border-dark-3 bg-white-3 p-1 invalid:border-red focus:border-blue focus:outline-none"
          type="text"
          maxLength={30}
          placeholder="Private key ..."
          id="key"
          defaultValue={code as string | undefined}
        />
      </div>
    );
  }
}

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
