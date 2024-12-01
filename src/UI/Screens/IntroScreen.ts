import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import AbstractScreen from './AbstractScreen';
import mitt, { Emitter } from 'mitt';
import SceneConfig from '../../scene/Configs/Main/SceneConfig';
import AudioController from '../../scene/GameScene/AudioController';

type Events = {
  onStartClick: string;
};

export default class IntroScreen extends AbstractScreen {
  private startGameText: PIXI.Text;
  private gameNameTextLeft: PIXI.Text;
  private gameNameTextRight: PIXI.Text;
  private tutorialText: PIXI.Text;

  private isMobile: boolean;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.isMobile = PIXI.isMobile.any;

    this.init();
  }

  public onResize(width: number, height: number): void {
    if (this.isMobile) {
      this.gameNameTextLeft.scale.set(0.6);
      this.gameNameTextRight.scale.set(0.6);
      this.startGameText.scale.set(0.6);
      this.tutorialText.scale.set(0.6);

      if (width < height) { // portrait
        this.gameNameTextLeft.x = width * 0.5 - 15;
        this.gameNameTextLeft.y = 130;
    
        this.gameNameTextRight.x = width * 0.5 - 15;
        this.gameNameTextRight.y = 130;
    
        this.startGameText.x = width * 0.5;
        this.startGameText.y = height - 250;
    
        this.tutorialText.x = width * 0.5;
        this.tutorialText.y = height - 100;
      } else { // landscape
        this.gameNameTextLeft.x = width * 0.5 - 15;
        this.gameNameTextLeft.y = 60;
    
        this.gameNameTextRight.x = width * 0.5 - 15;
        this.gameNameTextRight.y = 60;
    
        this.startGameText.x = width * 0.5;
        this.startGameText.y = height - 120;
    
        this.tutorialText.x = width * 0.5;
        this.tutorialText.y = height - 50;
      }
    } else { // desktop
      this.gameNameTextLeft.x = width * 0.5;
      this.gameNameTextLeft.y = 100;
  
      this.gameNameTextRight.x = width * 0.5;
      this.gameNameTextRight.y = 100;
  
      this.startGameText.x = width * 0.5;
      this.startGameText.y = height - 300;
  
      this.tutorialText.x = width * 0.5;
      this.tutorialText.y = height - 80;
    }

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

    gameNameTextLeft.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
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

    gameNameTextRight.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    gameNameTextRight.anchor.set(0, 0.5);

    this.addChild(gameNameTextRight);
  }

  private initStartGameText(): void {
    const startGameText = this.startGameText = new Text({
      text: 'Start Game',
      style: {
        fontFamily: 'riky',
        fill: 0xfa3240,
        fontSize: 100,
        align: 'center',
      },
    });

    startGameText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    startGameText.anchor.set(0.5);

    this.addChild(startGameText);

    startGameText.eventMode = 'static';
    startGameText.cursor = 'pointer';

    startGameText.on('pointerdown', () => {
      this.emitter.emit('onStartClick');

      setTimeout(() => {
        AudioController.getInstance().playMusic();
      }, 200);
    });
  }

  private initTutorialText(): void {
    let tutorialTextString: string = 'Press w, a, s, d or arrows to move';

    if (this.isMobile) {
      tutorialTextString = 'Swipe to move';
    }

    const tutorialText = this.tutorialText = new Text({
      text: tutorialTextString,
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    tutorialText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    tutorialText.anchor.set(0.5);

    this.addChild(tutorialText);
  }
}
