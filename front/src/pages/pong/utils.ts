import * as PIXI from 'pixi.js';

import { Ball } from './BallPaddle';
import { game } from './config';
import { ScreenManager } from './ScreenManager';

export function resize_game(app: PIXI.Application<HTMLCanvasElement>) {
  const real_window_h = window.innerHeight - 64; // remove navbar height
  if (
    window.innerWidth >= game.screen.maxWidth &&
    real_window_h >= game.screen.maxHeight &&
    app.renderer.width == game.screen.maxWidth &&
    app.renderer.height == game.screen.maxHeight
  )
    return;
  let coeff_w: number = window.innerWidth / app.renderer.width;
  let coeff_h: number = real_window_h / app.renderer.height;
  if (coeff_w < coeff_h) {
    coeff_w =
      app.renderer.width * coeff_w < game.screen.maxWidth
        ? coeff_w
        : game.screen.maxWidth / app.renderer.width;
    coeff_w =
      app.renderer.width * coeff_w > game.screen.minWidth
        ? coeff_w
        : game.screen.minWidth / app.renderer.width;
    app.stage.width *= coeff_w;
    app.stage.height *= coeff_w;
    app.renderer.resize(app.renderer.width * coeff_w, app.renderer.height * coeff_w);
  } else {
    coeff_h =
      app.renderer.height * coeff_h < game.screen.maxHeight
        ? coeff_h
        : game.screen.maxHeight / app.renderer.height;
    coeff_h =
      app.renderer.width * coeff_h > game.screen.minWidth
        ? coeff_h
        : game.screen.minWidth / app.renderer.width;
    app.stage.width *= coeff_h;
    app.stage.height *= coeff_h;
    app.renderer.resize(app.renderer.width * coeff_h, app.renderer.height * coeff_h);
  }
}

export function createPickable(app: PIXI.Application<HTMLCanvasElement>): PIXI.Graphics {
  const tmp = new PIXI.Graphics();

  tmp.beginFill(game.pickable.color);
  tmp.drawCircle(0, 0, game.pickable.radius);
  tmp.endFill();
  tmp.visible = false;

  app.stage.addChild(tmp);

  return tmp;
}

export function movePickable(newPos: PIXI.Rectangle, pick: PIXI.Graphics) {
  pick.x = newPos.x + pick.width / 2;
  pick.y = newPos.y + pick.height / 2;
}

export function gameScreen(app: PIXI.Application<HTMLCanvasElement>) {
  app.view.style.visibility = 'visible';
  document.getElementById('ClassicQueue')!.style.visibility = 'hidden';
  document.getElementById('BonusQueue')!.style.visibility = 'hidden';
  document.getElementById('key')!.style.visibility = 'hidden';
}

export function buttonScreen(
  app: PIXI.Application<HTMLCanvasElement>,
  screenManager: ScreenManager,
) {
  screenManager.cleanScreen();
  app.view.style.visibility = 'hidden';
  document.getElementById('ClassicQueue')!.style.visibility = 'visible';
  document.getElementById('BonusQueue')!.style.visibility = 'visible';
  document.getElementById('key')!.style.visibility = 'visible';
}

export function bounceBall(pos: PIXI.Rectangle, dir: PIXI.Point, ball: Ball) {
  ball.sprite.x = pos.x + 10;
  ball.sprite.y = pos.y + 10;
  ball.direction.x = dir.x;
  ball.direction.y = dir.y;
}

export function createText(
  text: number | string,
  size: number,
  color: number,
  app: PIXI.Application<HTMLCanvasElement>,
) {
  const tmp = new PIXI.Text(text, {
    fontFamily: 'Arial',
    fontSize: size,
    fill: color,
    align: 'center',
  });
  tmp.visible = false;
  app.stage.addChild(tmp);
  return tmp;
}

export function updateScore(score: number, text: PIXI.Text): number {
  score++;
  text.text = score;
  return score;
}
