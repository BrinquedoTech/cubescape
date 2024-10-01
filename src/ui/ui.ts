import * as PIXI from 'pixi.js';
import Button from './button';
import { Runner } from '@pixi/runner';

export default class UI extends PIXI.Container {
  private buttonRotateRight: Button;
  private buttonRotateLeft: Button;
  private buttonRotateUp: Button;
  private buttonRotateDown: Button;

  public runner: any;

  constructor() {
    super();

    this.buttonRotateRight = null;

    this.runner = {
      'rotateRight': new Runner('rotateRight'),
      'rotateLeft': new Runner('rotateLeft'),
      'rotateUp': new Runner('rotateUp'),
      'rotateDown': new Runner('rotateDown'),
    };

    this._init();
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.buttonRotateRight.x = width * 0.5 + 350;
    this.buttonRotateRight.y = height * 0.5;

    this.buttonRotateLeft.x = width * 0.5 - 350;
    this.buttonRotateLeft.y = height * 0.5;

    this.buttonRotateUp.x = width * 0.5;
    this.buttonRotateUp.y = height * 0.5 - 350;

    this.buttonRotateDown.x = width * 0.5;
    this.buttonRotateDown.y = height * 0.5 + 350;
  }

  _init() {
    const buttonRotateRight = this.buttonRotateRight = new Button('assets/arrow-right.png');
    this.addChild(buttonRotateRight);

    buttonRotateRight.runner.add({
      click: () => {
        this.runner.rotateRight.emit('rotateRight');
      }
    });

    const buttonRotateLeft = this.buttonRotateLeft = new Button('assets/arrow-left.png');
    this.addChild(buttonRotateLeft);

    buttonRotateLeft.runner.add({
      click: () => {
        this.runner.rotateLeft.emit('rotateLeft');
      }
    });

    const buttonRotateUp = this.buttonRotateUp = new Button('assets/arrow-up.png');
    this.addChild(buttonRotateUp);

    buttonRotateUp.runner.add({
      click: () => {
        this.runner.rotateUp.emit('rotateUp');
      }
    });

    const buttonRotateDown = this.buttonRotateDown = new Button('assets/arrow-down.png');
    this.addChild(buttonRotateDown);

    buttonRotateDown.runner.add({
      click: () => {
        this.runner.rotateDown.emit('rotateDown');
      }
    });
  }
}
