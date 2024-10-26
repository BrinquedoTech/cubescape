import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import { Graphics } from 'pixi.js';
import AbstractScreen from './AbstractScreen';
import mitt, { Emitter } from 'mitt';

type Events = {
  onStartClick: string;
};

export default class IntroScreen extends AbstractScreen {
  private startGameText: PIXI.Text;
  private gameNameText: PIXI.Text;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.init();
  }

  public onResize(width: number, height: number): void {
    this.gameNameText.x = width * 0.5;
    this.gameNameText.y = 150;

    this.startGameText.x = width * 0.5;
    this.startGameText.y = height - 150;
  }

  private init(): void {
    this.initOverlay();
    this.initGameNameText();
    this.initStartGameText();
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

  private initGameNameText(): void {
    const gameNameText = this.gameNameText = new Text({
      text: 'Cube Game',
      style: {
        fill: 0xffffff,
        fontSize: 100,
        align: 'center',
      },
    });

    gameNameText.anchor.set(0.5);

    this.addChild(gameNameText);

    gameNameText.eventMode = 'none';
  }

  private initStartGameText(): void {
    const startGameText = this.startGameText = new Text({
      text: 'Start Game',
      style: {
        fill: 0x00ff00,
        fontSize: 70,
        align: 'center',
      },
    });

    startGameText.anchor.set(0.5);

    this.addChild(startGameText);

    startGameText.eventMode = 'static';
    startGameText.cursor = 'pointer';

    startGameText.on('pointerdown', () => {
      this.emitter.emit('onStartClick');
    });
  }
}
