import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
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
    this.initGameNameText();
    this.initStartGameText();
  }

  private initGameNameText(): void {
    const gameNameText = this.gameNameText = new Text({
      text: 'CUBESCAPE',
      style: {
        fontFamily: 'casper',
        fill: 0x000000,
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
        fontFamily: 'riky',
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
