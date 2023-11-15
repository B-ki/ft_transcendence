import * as PIXI from 'pixi.js';

import { DashLine } from './DashLine';

export class ScreenManager {
  private bonusMode: boolean = false;
  constructor(
    private ball: PIXI.Graphics,
    private pad1: PIXI.Graphics,
    private pad2: PIXI.Graphics,
    private pick1: PIXI.Graphics,
    private pick2: PIXI.Graphics,
    private middleLine: DashLine,
    private countDown: PIXI.Text,
    private p1Score: PIXI.Text,
    private p2Score: PIXI.Text,
    private loadingText: PIXI.Text,
    private endText: PIXI.Text,
    private buttonQuit: PIXI.Graphics,
    private buttonQuitText: PIXI.Text,
    private buttonLeave: PIXI.Graphics,
    private buttonLeaveText: PIXI.Text,
  ) {}

  queueScreen() {
    this.loadingText.visible = true;
    this.buttonLeave.visible = true;
    this.buttonLeaveText.visible = true;
  }

  countdownScreen() {
    this.loadingText.visible = false;
    this.buttonLeave.visible = false;
    this.buttonLeaveText.visible = false;

    this.countDown.visible = true;
  }

  playScreen() {
    this.countDown.visible = false;

    this.middleLine.showLine();
    this.pad1.visible = true;
    this.pad2.visible = true;
    this.ball.visible = true;
    this.p1Score.visible = true;
    this.p2Score.visible = true;
    if (this.bonusMode) {
      this.pick1.visible = true;
      this.pick2.visible = true;
    }
  }

  endScreen() {
    this.middleLine.hideLine();
    this.pad1.visible = false;
    this.pad2.visible = false;
    this.ball.visible = false;
    this.pick1.visible = false;
    this.pick2.visible = false;
    this.countDown.visible = false;

    this.endText.visible = true;
    this.buttonQuit.visible = true;
    this.buttonQuitText.visible = true;
  }

  cleanScreen() {
    this.endText.visible = false;
    this.loadingText.visible = false;
    this.p1Score.visible = false;
    this.p2Score.visible = false;
    this.buttonQuit.visible = false;
    this.buttonQuitText.visible = false;
  }

  setMode(mode: boolean) {
    this.bonusMode = mode;
  }
}
