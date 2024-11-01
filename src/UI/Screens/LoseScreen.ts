import mitt, { Emitter } from 'mitt';
import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import { Graphics } from 'pixi.js';
import AbstractScreen from './AbstractScreen';
import SceneConfig from '../../core/configs/SceneConfig';

type Events = {
  onStartAgain: void;
};

export default class LoseScreen extends AbstractScreen {
  private loseText: PIXI.Text;
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
      this.loseText.scale.set(0.6);
      this.startAgainText.scale.set(0.6);

      if (width < height) { // portrait
        this.overlay.clear();
        this.overlay.rect(0, 0, width, height);
        this.overlay.fill({ color: 0x000000, alpha: 0.4 });

        this.loseText.x = width * 0.5;
        this.loseText.y = height * 0.5;
    
        this.startAgainText.x = width * 0.5;
        this.startAgainText.y = height - 130;
      } else { // landscape
        this.overlay.clear();
        this.overlay.rect(0, 0, width, height);
        this.overlay.fill({ color: 0x000000, alpha: 0.4 });

        this.loseText.x = width * 0.5;
        this.loseText.y = height * 0.5;
    
        this.startAgainText.x = width * 0.5;
        this.startAgainText.y = height - 60;
      }
    } else { // desktop
      this.overlay.clear();
      this.overlay.rect(0, 0, width, height);
      this.overlay.fill({ color: 0x000000, alpha: 0.4 });

      this.loseText.x = width * 0.5;
      this.loseText.y = height * 0.5;
  
      this.startAgainText.x = width * 0.5;
      this.startAgainText.y = height - 200;
    }
  }

  private init(): void {
    this.initOverlay();
    this.initLoseText();
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

    loseText.resolution = Math.min(window.devicePixelRatio, SceneConfig.maxPixelRatio);
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