import mitt, { Emitter } from 'mitt';
import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import { Graphics } from 'pixi.js';
import AbstractScreen from './AbstractScreen';
import SCENE_CONFIG from '../../core/configs/scene-config';

type Events = {
  onStartAgain: void;
};

export default class LoseScreen extends AbstractScreen {
  private loseText: PIXI.Text;
  private startAgainText: PIXI.Text;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.init();
  }

  public onResize(width: number, height: number): void {
    this.loseText.x = width * 0.5;
    this.loseText.y = height * 0.5;

    this.startAgainText.x = width * 0.5;
    this.startAgainText.y = height - 200;
  }

  private init(): void {
    this.initOverlay();
    this.initLoseText();
    this.initStartAgainText();
  }

  private initOverlay(): void {
    const overlay = new Graphics();
    overlay.rect(0, 0, window.innerWidth, window.innerHeight);
    overlay.fill({
      color: 0x000000,
      alpha: 0.4,
    })

    this.addChild(overlay);
  }

  private initLoseText(): void {
    const loseText = this.loseText = new Text({
      text: 'Game Over',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 100,
        align: 'center',
      },
    });

    loseText.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    loseText.anchor.set(0.5);

    this.addChild(loseText);
  }

  private initStartAgainText(): void {
    const startAgainText = this.startAgainText = new Text({
      text: 'Start again',
      style: {
        fontFamily: 'riky',
        fill: 0xfa3240,
        fontSize: 70,
        align: 'center',
      },
    });

    startAgainText.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    startAgainText.anchor.set(0.5);

    this.addChild(startAgainText);

    startAgainText.eventMode = 'static';
    startAgainText.cursor = 'pointer';

    startAgainText.on('pointerdown', () => {
      this.emitter.emit('onStartAgain');
    });
  }
}