import mitt, { Emitter } from 'mitt';
import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import { Graphics } from 'pixi.js';
import AbstractScreen from './AbstractScreen';
import SceneConfig from '../../Data/Configs/Main/SceneConfig';
import { ScoreConfig } from '../../Data/Configs/ScoreConfig';
import { ILevelScore } from '../../Data/Interfaces/IScore';

type Events = {
  onNextLevelClick: string;
};

export default class LevelWinScreen extends AbstractScreen {
  private levelWinText: PIXI.Text;
  private nextLevelText: PIXI.Text;
  private coinsScoreText: PIXI.Text;
  private bonusAllScoreText: PIXI.Text;
  private bonusForTimeText: PIXI.Text;
  private timeText: PIXI.Text;
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
      this.levelWinText.scale.set(0.5);
      this.timeText.scale.set(0.6);
      this.coinsScoreText.scale.set(0.6);
      this.bonusAllScoreText.scale.set(0.6);
      this.bonusForTimeText.scale.set(0.6);
      this.nextLevelText.scale.set(0.6);

      if (width < height) { // portrait
        this.overlay.clear();
        this.overlay.rect(0, 0, width, height);
        this.overlay.fill({ color: 0x000000, alpha: 0.4 });

        this.levelWinText.x = width * 0.5;
        this.levelWinText.y = 100;
    
        this.timeText.x = width * 0.5;
        this.timeText.y = height * 0.5 - 180;
    
        this.coinsScoreText.x = width * 0.5;
        this.coinsScoreText.y = height * 0.5 - 70;
    
        this.bonusAllScoreText.x = width * 0.5;
        this.bonusAllScoreText.y = height * 0.5;
    
        this.bonusForTimeText.x = width * 0.5;
        this.bonusForTimeText.y = height * 0.5 + 70;
    
        this.nextLevelText.x = width * 0.5;
        this.nextLevelText.y = height - 130;
      } else { // landscape
        this.overlay.clear();
        this.overlay.rect(0, 0, width, height);
        this.overlay.fill({ color: 0x000000, alpha: 0.4 });

        this.levelWinText.x = width * 0.5;
        this.levelWinText.y = 40;
    
        this.timeText.x = width * 0.5;
        this.timeText.y = height * 0.5 - 110;
    
        this.coinsScoreText.x = width * 0.5;
        this.coinsScoreText.y = height * 0.5 - 50;
    
        this.bonusAllScoreText.x = width * 0.5;
        this.bonusAllScoreText.y = height * 0.5;
    
        this.bonusForTimeText.x = width * 0.5;
        this.bonusForTimeText.y = height * 0.5 + 50;
    
        this.nextLevelText.x = width * 0.5;
        this.nextLevelText.y = height - 60;
      }
    } else { // desktop
      this.overlay.clear();
      this.overlay.rect(0, 0, width, height);
      this.overlay.fill({ color: 0x000000, alpha: 0.4 });
      
      this.levelWinText.x = width * 0.5;
      this.levelWinText.y = height * 0.5 - 350;
  
      this.timeText.x = width * 0.5;
      this.timeText.y = height * 0.5 - 250;
  
      this.coinsScoreText.x = width * 0.5;
      this.coinsScoreText.y = height * 0.5 - 100;
  
      this.bonusAllScoreText.x = width * 0.5;
      this.bonusAllScoreText.y = height * 0.5;
  
      this.bonusForTimeText.x = width * 0.5;
      this.bonusForTimeText.y = height * 0.5 + 100;
  
      this.nextLevelText.x = width * 0.5;
      this.nextLevelText.y = height - 200;
    }
  }

  public setLevelTime(time: number): void {
    const timeWithDecimals = time.toFixed(3);
    this.timeText.text = `Your time: ${timeWithDecimals} sec`;
  }

  public setScoreForLevel(score: ILevelScore): void {
    const scoreForCoins: number = score.coinsCollected * ScoreConfig.coin;
    const bonusAllCoins: number = score.bonusAllCoins ? ScoreConfig.allCoinsBonus : 0;

    this.coinsScoreText.text = `Score for coins: ${scoreForCoins}`;
    this.bonusAllScoreText.text = `Bonus for all coins: ${bonusAllCoins}`;
    this.bonusForTimeText.text = `Time bonus: ${score.timeBonus}`;
  }

  private init(): void {
    this.initOverlay();
    this.initLevelWinText();
    this.initTimeText();
    this.initCoinsScoreText();
    this.initBonusAllCoinsText();
    this.initBonusForTimeText();
    this.initNextLevelText();
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

  private initLevelWinText(): void {
    const levelWinText = this.levelWinText = new Text({
      text: 'Level completed',
      style: {
        fontFamily: 'riky',
        fill: 0xffd700,
        fontSize: 100,
        align: 'center',
      },
    });

    levelWinText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    levelWinText.anchor.set(0.5);

    this.addChild(levelWinText);
  }

  private initTimeText(): void {
    const timeText = this.timeText = new Text({
      text: 'Your time: 0',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 60,
        align: 'center',
      },
    });

    timeText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    timeText.anchor.set(0.5);

    this.addChild(timeText);
  }

  private initCoinsScoreText(): void {
    const coinsScoreText = this.coinsScoreText = new Text({
      text: 'Score for coins: 0',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    coinsScoreText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    coinsScoreText.anchor.set(0.5);

    this.addChild(coinsScoreText);
  }

  private initBonusAllCoinsText(): void {
    const bonusAllScoreText = this.bonusAllScoreText = new Text({
      text: 'Bonus for all coins: 0',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    bonusAllScoreText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    bonusAllScoreText.anchor.set(0.5);

    this.addChild(bonusAllScoreText);
  }

  private initBonusForTimeText(): void {
    const bonusForTimeText = this.bonusForTimeText = new Text({
      text: 'Time bonus: 0',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    bonusForTimeText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    bonusForTimeText.anchor.set(0.5);

    this.addChild(bonusForTimeText);
  }

  private initNextLevelText(): void {
    const nextLevelText = this.nextLevelText = new Text({
      text: 'Next Level',
      style: {
        fontFamily: 'riky',
        fill: 0xfa3240,
        fontSize: 70,
        align: 'center',
      },
    });

    nextLevelText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
    nextLevelText.anchor.set(0.5);

    this.addChild(nextLevelText);

    nextLevelText.eventMode = 'static';
    nextLevelText.cursor = 'pointer';

    nextLevelText.on('pointerdown', () => {
      this.emitter.emit('onNextLevelClick');
    });
  }
}