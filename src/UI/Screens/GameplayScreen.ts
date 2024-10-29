import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import AbstractScreen from './AbstractScreen';

export default class GameplayScreen extends AbstractScreen {
  private scoreText: PIXI.Text;
  private livesText: PIXI.Text;
  private currentLevelText: PIXI.Text;

  constructor() {
    super();

    this.init();
  }

  public onResize(width: number, _height?: number): void {
    this.livesText.x = 300;
    this.livesText.y = 70;

    this.currentLevelText.x = width * 0.5;
    this.currentLevelText.y = 70;

    this.scoreText.x = width - 300;
    this.scoreText.y = 70;
  }

  private init(): void {
    this.initLives();
    this.initCurrentLevel();
    this.initScore();
  }

  private initLives(): void {
    const livesText = this.livesText = new Text({
      text: 'Lives: 3',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    livesText.anchor.set(0.5);

    this.addChild(livesText);
  }

  private initCurrentLevel(): void {
    const currentLevelText = this.currentLevelText = new Text({
      text: 'Level: 1',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    currentLevelText.anchor.set(0.5);

    this.addChild(currentLevelText);
  }

  private initScore(): void {
    const score = this.scoreText = new Text({
      text: 'Score: 0',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    score.anchor.set(0.5);

    this.addChild(score);
  }
}