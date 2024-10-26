import mitt, { Emitter } from 'mitt';
import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import { Graphics } from 'pixi.js';
import AbstractScreen from './AbstractScreen';

type Events = {
  onNextLevelClick: string;
};

export default class LevelWinScreen extends AbstractScreen {
  private levelWinText: PIXI.Text;
  private nextLevelText: PIXI.Text;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.init();
  }

  public onResize(width: number, height: number): void {
    this.levelWinText.x = width * 0.5;
    this.levelWinText.y = height * 0.5;

    this.nextLevelText.x = width * 0.5;
    this.nextLevelText.y = height - 200;
  }

  private init(): void {
    this.initOverlay();
    this.initLevelWinText();
    this.initNextLevelText();
  }

  private initOverlay(): void {
    const overlay = new Graphics();
    overlay.rect(0, 0, window.innerWidth, window.innerHeight);
    overlay.fill({
      color: 0x000000,
      alpha: 0.4,
    })

    this.addChild(overlay);

    overlay.eventMode = 'none';
  }

  private initLevelWinText(): void {
    const levelWinText = this.levelWinText = new Text({
      text: 'You win level!',
      style: {
        fill: 0xffffff,
        fontSize: 80,
        align: 'center',
      },
    });

    levelWinText.anchor.set(0.5);

    this.addChild(levelWinText);

    levelWinText.eventMode = 'none';
  }

  private initNextLevelText(): void {
    const nextLevelText = this.nextLevelText = new Text({
      text: 'Next Level',
      style: {
        fill: 0x00ff00,
        fontSize: 70,
        align: 'center',
      },
    });

    nextLevelText.anchor.set(0.5);

    this.addChild(nextLevelText);

    nextLevelText.eventMode = 'static';
    nextLevelText.cursor = 'pointer';

    nextLevelText.on('pointerdown', () => {
      this.emitter.emit('onNextLevelClick');
    });
  }
}