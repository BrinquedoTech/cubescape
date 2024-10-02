import * as PIXI from 'pixi.js';
import Button from './Button';
import { Runner } from '@pixi/runner';

export default class UI extends PIXI.Container {
  private buttonRotateRight: Button;
  private buttonRotateLeft: Button;
  private buttonRotateUp: Button;
  private buttonRotateDown: Button;
  private buttonRotateClockwise: Button;
  private buttonRotateCounterClockwise: Button;

  public runner: any;

  constructor() {
    super();

    this.runner = {
      'rotateRight': new Runner('rotateRight'),
      'rotateLeft': new Runner('rotateLeft'),
      'rotateUp': new Runner('rotateUp'),
      'rotateDown': new Runner('rotateDown'),
      'rotateClockwise': new Runner('rotateClockwise'),
      'rotateCounterClockwise': new Runner('rotateCounterClockwise'),
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

    this.buttonRotateClockwise.x = width * 0.5 + 350;
    this.buttonRotateClockwise.y = height * 0.5 - 350;

    this.buttonRotateCounterClockwise.x = width * 0.5 - 350;
    this.buttonRotateCounterClockwise.y = height * 0.5 - 350;
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

    const buttonRotateClockwise = this.buttonRotateClockwise = new Button('assets/arrow-clockwise.png');
    this.addChild(buttonRotateClockwise);

    buttonRotateClockwise.runner.add({
      click: () => {
        this.runner.rotateClockwise.emit('rotateClockwise');
      }
    });

    const buttonRotateCounterClockwise = this.buttonRotateCounterClockwise = new Button('assets/arrow-counter-clockwise.png');
    this.addChild(buttonRotateCounterClockwise);

    buttonRotateCounterClockwise.runner.add({
      click: () => {
        this.runner.rotateCounterClockwise.emit('rotateCounterClockwise');
      }
    });
  }
}
