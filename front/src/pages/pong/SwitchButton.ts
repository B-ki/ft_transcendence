import * as PIUI from '@pixi/ui';
import * as PIXI from 'pixi.js';

import { createText } from './utils';

export class TextButton {
  public graphics: PIXI.Graphics;
  public button: PIUI.Button;
  public text: PIXI.Text;

  constructor(
    textArg: number | string,
    x: number,
    y: number,
    app: PIXI.Application<HTMLCanvasElement>,
  ) {
    this.graphics = new PIXI.Graphics()
      .beginFill(0xaeb8b1)
      .drawRoundedRect(x - 50, y - 25, 100, 50, 15);
    this.graphics.visible = false;
    app.stage.addChild(this.graphics);
    this.text = createText(textArg, 30, 0x171717, app);
    this.text.anchor.set(0.5, 0.5);
    this.text.x = x;
    this.text.y = y;
    this.button = new PIUI.Button(this.graphics);
  }

  onClick(callback: () => void) {
    this.button.onUp.connect(callback);
  }

  // button.onPress.connect(() => {
  //   buttonScreen(app);
  // });
  // const quitText: PIXI.Text = new PIXI.Text('Quit', {
  //   fontFamily: 'Arial',
  //   fontSize: 24,
  //   fill: 0x000000,
  //   align: 'center',
  // });
  // quitText.anchor.set(0.5, 0.5);
  // quitText.x = game.screen.width / 2;
  // quitText.y = game.screen.height * (4 / 5);
  // app.stage.addChild(button.view);
  // app.stage.addChild(quitText);
}
