import * as PIXI from 'pixi.js';
import Button from './button';

export default class UI extends PIXI.Container {
  private spinButton: Button;

  constructor() {
    super();

    this.spinButton = null;

    this._init();
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // this._spinButton.x = width / 2;
    // this._spinButton.y = height * 0.8;
  }

  _init() {
    // const spinButton = this._spinButton = new Button('assets/btn_spin_up');
    // this.addChild(spinButton);

    // spinButton.runner.add({
    //   click: () => {
    //     console.log('spin button clicked');
    //   }
    // });
  }
}
