import mitt, { Emitter } from 'mitt';
import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import { Graphics } from 'pixi.js';
import AbstractScreen from './AbstractScreen';
import SceneConfig from '../../Scene2/Configs/Main/SceneConfig';

type Events = {
  onStartAgain: void;
};

export default class GameWinScreen extends AbstractScreen {
  private congratulationsText: PIXI.Text;
  private winAllLevelsText: PIXI.Text;
  private overallScoreText: PIXI.Text;
  private startAgainText: PIXI.Text;
  private overlay: PIXI.Graphics;

  private isMobile: boolean;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.isMobile = PIXI.isMobile.any;

    this.init();
  }

  public onResize(width: number, height: number): void {
    if (this.isMobile) {
      this.congratulationsText.scale.set(0.5);
      this.winAllLevelsText.scale.set(0.55);
      this.overallScoreText.scale.set(0.6);
      this.startAgainText.scale.set(0.6);

      if (width < height) { // portrait
        this.overlay.clear();
        this.overlay.rect(0, 0, width, height);
        this.overlay.fill({ color: 0x000000, alpha: 0.4 });

        this.congratulationsText.x = width * 0.5;
        this.congratulationsText.y = 150;
    
        this.winAllLevelsText.text = "You've completed\nall levels !";
        this.winAllLevelsText.x = width * 0.5;
        this.winAllLevelsText.y = height * 0.5 - 150;
    
        this.overallScoreText.x = width * 0.5;
        this.overallScoreText.y = height * 0.5;
    
        this.startAgainText.x = width * 0.5;
        this.startAgainText.y = height - 130;
      } else { // landscape
        this.overlay.clear();
        this.overlay.rect(0, 0, width, height);
        this.overlay.fill({ color: 0x000000, alpha: 0.4 });

        this.congratulationsText.x = width * 0.5;
        this.congratulationsText.y = 70;
    
        this.winAllLevelsText.text = "You've completed all levels !";
        this.winAllLevelsText.x = width * 0.5;
        this.winAllLevelsText.y = height * 0.5 - 40;
    
        this.overallScoreText.x = width * 0.5;
        this.overallScoreText.y = height * 0.5 + 40;
    
        this.startAgainText.x = width * 0.5;
        this.startAgainText.y = height - 60;
      }
    } else { // desktop
      this.overlay.clear();
      this.overlay.rect(0, 0, width, height);
      this.overlay.fill({ color: 0x000000, alpha: 0.4 });
      this.congratulationsText.x = width * 0.5;
      this.congratulationsText.y = height * 0.5 - 300;
  
      this.winAllLevelsText.x = width * 0.5;
      this.winAllLevelsText.y = height * 0.5 - 150;
  
      this.overallScoreText.x = width * 0.5;
      this.overallScoreText.y = height * 0.5;
  
      this.startAgainText.x = width * 0.5;
      this.startAgainText.y = height - 200;
    }
  }

  public setOverallScore(score: number): void {
    this.overallScoreText.text = `Overall score: ${score}`;
  }

  private init(): void {
    this.initOverlay();
    this.initCongratulationsText();
    this.initWinAllLevelsText();
    this.initOverallScoreText();
    this.initStartAgainText();
  }

  private initOverlay(): void {
    const overlay = this.overlay = new Graphics();
    overlay.rect(0, 0, window.innerWidth, window.innerHeight);
    overlay.fill({
      color: 0x000000,
      alpha: 0.4,
    })

    this.addChild(overlay);
  }

  private initCongratulationsText(): void {
    const congratulationsText = this.congratulationsText = new Text({
      text: 'Congratulations !',
      style: {
        fontFamily: 'riky',
        fill: 0xffd700,
        fontSize: 100,
        align: 'center',
      },
    });

    congratulationsText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    congratulationsText.anchor.set(0.5);

    this.addChild(congratulationsText);
  }

  private initWinAllLevelsText(): void {
    const winAllLevelsText = this.winAllLevelsText = new Text({
      text: "You've completed all levels !",
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 70,
        align: 'center',
      },
    });

    winAllLevelsText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    winAllLevelsText.anchor.set(0.5);

    this.addChild(winAllLevelsText);
  }

  private initOverallScoreText(): void {
    const overallScoreText = this.overallScoreText = new Text({
      text: 'Overall score: 0',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 60,
        align: 'center',
      },
    });

    overallScoreText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    overallScoreText.anchor.set(0.5);

    this.addChild(overallScoreText);
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

    startAgainText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    startAgainText.anchor.set(0.5);

    this.addChild(startAgainText);

    startAgainText.eventMode = 'static';
    startAgainText.cursor = 'pointer';

    startAgainText.on('pointerdown', () => {
      this.emitter.emit('onStartAgain');
    });
  }
}