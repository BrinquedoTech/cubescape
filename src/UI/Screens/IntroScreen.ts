import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import AbstractScreen from './AbstractScreen';
import mitt, { Emitter } from 'mitt';
import SCENE_CONFIG from '../../core/configs/scene-config';

type Events = {
  onStartClick: string;
};

export default class IntroScreen extends AbstractScreen {
  private startGameText: PIXI.Text;
  private gameNameTextLeft: PIXI.Text;
  private gameNameTextRight: PIXI.Text;
  private tutorialText: PIXI.Text;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.init();
  }

  public onResize(width: number, height: number): void {
    this.gameNameTextLeft.x = width * 0.5;
    this.gameNameTextLeft.y = 100;

    this.gameNameTextRight.x = width * 0.5;
    this.gameNameTextRight.y = 100;

    this.startGameText.x = width * 0.5;
    this.startGameText.y = height - 300;

    this.tutorialText.x = width * 0.5;
    this.tutorialText.y = height - 60;
  }

  private init(): void {
    this.initGameNameText();
    this.initStartGameText();
    this.initTutorialText();
  }

  private initGameNameText(): void {
    const gameNameTextLeft = this.gameNameTextLeft = new Text({
      text: 'CUBE',
      style: {
        fontFamily: 'casper',
        fill: 0xffd700,
        fontSize: 100,
        align: 'right',
      },
    });

    gameNameTextLeft.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    gameNameTextLeft.anchor.set(1, 0.5);

    this.addChild(gameNameTextLeft);

    const gameNameTextRight = this.gameNameTextRight = new Text({
      text: 'SCAPE',
      style: {
        fontFamily: 'casper',
        fill: 0x000000,
        fontSize: 100,
        align: 'left',
      },
    });

    gameNameTextRight.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    gameNameTextRight.anchor.set(0, 0.5);

    this.addChild(gameNameTextRight);
  }

  private initStartGameText(): void {
    const startGameText = this.startGameText = new Text({
      text: 'Start Game',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 100,
        align: 'center',
      },
    });

    startGameText.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    startGameText.anchor.set(0.5);

    this.addChild(startGameText);

    startGameText.eventMode = 'static';
    startGameText.cursor = 'pointer';

    startGameText.on('pointerdown', () => {
      this.emitter.emit('onStartClick');
    });
  }

  private initTutorialText(): void {
    const tutorialText = this.tutorialText = new Text({
      text: 'Press w, a, s, d or arrows to move',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 40,
        align: 'center',
      },
    });

    tutorialText.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    tutorialText.anchor.set(0.5);

    this.addChild(tutorialText);
  }
}
