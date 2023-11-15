import * as PIXI from 'pixi.js';

import { game } from './config';

export class DashLine {
  private rectangles: PIXI.Graphics[] = [];
  private nbRectangles: number = 50;

  constructor(app: PIXI.Application<HTMLCanvasElement>) {
    for (let i: number = 0; i < this.nbRectangles; i++) {
      const dash: PIXI.Graphics = new PIXI.Graphics();
      dash.beginFill(0xaeb8b1);
      dash.drawRoundedRect(game.screen.width / 2 - 1, i * 30, 2, 15, 3);
      dash.endFill();
      dash.visible = false;
      app.stage.addChild(dash);
      this.rectangles.push(dash);
    }
  }

  showLine() {
    for (const dash of this.rectangles) {
      dash.visible = true;
    }
  }

  hideLine() {
    for (const dash of this.rectangles) {
      dash.visible = false;
    }
  }
}
