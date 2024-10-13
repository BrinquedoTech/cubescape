import * as PIXI from 'pixi.js';
import mitt, { Emitter } from 'mitt';
import RotateButtons from './RotateButtons';

type Events = {
  rotateRight: string;
  rotateLeft: string;
  rotateUp: string;
  rotateDown: string;
  rotateClockwise: string;
  rotateCounterClockwise: string;
};

export default class UI extends PIXI.Container {
  private rotateButtons: RotateButtons;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.init();
  }

  onResize() {
    this.rotateButtons.onResize();

    const width = window.innerWidth;
    const height = window.innerHeight;

    this.rotateButtons.x = width * 0.5;
    this.rotateButtons.y = height * 0.5;
  }

  private init(): void {
    this.initRotateButtons();
  }

  private initRotateButtons(): void {
    const rotateButtons = this.rotateButtons = new RotateButtons();
    // this.addChild(rotateButtons);

    rotateButtons.emitter.on('rotateRight', () => this.emitter.emit('rotateRight'));
    rotateButtons.emitter.on('rotateLeft', () => this.emitter.emit('rotateLeft'));
    rotateButtons.emitter.on('rotateUp', () => this.emitter.emit('rotateUp'));
    rotateButtons.emitter.on('rotateDown', () => this.emitter.emit('rotateDown'));
    rotateButtons.emitter.on('rotateClockwise', () => this.emitter.emit('rotateClockwise'));
    rotateButtons.emitter.on('rotateCounterClockwise', () => this.emitter.emit('rotateCounterClockwise'));
  }
}
