import * as PIXI from 'pixi.js';
import mitt, { Emitter } from 'mitt';
import Button from './Button';

type Events = {
  rotateRight: string;
  rotateLeft: string;
  rotateUp: string;
  rotateDown: string;
  rotateClockwise: string;
  rotateCounterClockwise: string;
};

export default class RotateButtons extends PIXI.Container {
  private buttonRotateRight: Button;
  private buttonRotateLeft: Button;
  private buttonRotateUp: Button;
  private buttonRotateDown: Button;
  private buttonRotateClockwise: Button;
  private buttonRotateCounterClockwise: Button;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.init();
  }

  public onResize(): void {
    const offset = 400;

    this.buttonRotateRight.x = offset;
    this.buttonRotateRight.y = 0;

    this.buttonRotateLeft.x = -offset;
    this.buttonRotateLeft.y = 0;

    this.buttonRotateUp.x = 0;
    this.buttonRotateUp.y = -offset;

    this.buttonRotateDown.x = 0;
    this.buttonRotateDown.y = 0 + offset;

    this.buttonRotateClockwise.x = offset;
    this.buttonRotateClockwise.y = -offset;

    this.buttonRotateCounterClockwise.x = -offset;
    this.buttonRotateCounterClockwise.y = -offset;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  private init(): void {
    this.initDebugButtons();
  }

  private initDebugButtons(): void {
    const buttonRotateRight = this.buttonRotateRight = new Button('assets/arrow-right.png');
    this.addChild(buttonRotateRight);

    const buttonRotateLeft = this.buttonRotateLeft = new Button('assets/arrow-left.png');
    this.addChild(buttonRotateLeft);
    
    const buttonRotateUp = this.buttonRotateUp = new Button('assets/arrow-up.png');
    this.addChild(buttonRotateUp);
    
    const buttonRotateDown = this.buttonRotateDown = new Button('assets/arrow-down.png');
    this.addChild(buttonRotateDown);
    
    const buttonRotateClockwise = this.buttonRotateClockwise = new Button('assets/arrow-clockwise.png');
    this.addChild(buttonRotateClockwise);
  
    const buttonRotateCounterClockwise = this.buttonRotateCounterClockwise = new Button('assets/arrow-counter-clockwise.png');
    this.addChild(buttonRotateCounterClockwise);

    this.initDebugButtonsSignals();
  }

  private initDebugButtonsSignals(): void {
    this.buttonRotateRight.emitter.on('click', () => this.emitter.emit('rotateRight'));
    this.buttonRotateLeft.emitter.on('click', () => this.emitter.emit('rotateLeft'));
    this.buttonRotateUp.emitter.on('click', () => this.emitter.emit('rotateUp'));
    this.buttonRotateDown.emitter.on('click', () => this.emitter.emit('rotateDown'));
    this.buttonRotateClockwise.emitter.on('click', () => this.emitter.emit('rotateClockwise'));
    this.buttonRotateCounterClockwise.emitter.on('click', () => this.emitter.emit('rotateCounterClockwise'));
  }
}