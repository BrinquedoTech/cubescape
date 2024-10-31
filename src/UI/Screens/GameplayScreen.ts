import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import AbstractScreen from './AbstractScreen';
import SCENE_CONFIG from '../../core/configs/scene-config';
import GameplayConfig from '../../scene/Configs/Main/GameplayConfig';

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

  public updateLevelText(level: number): void {
    this.currentLevelText.text = `Level ${level + 1}`;
  }

  public updateScore(score: number): void {
    this.scoreText.text = `Score: ${score}`;
  }

  public updateLives(lives: number): void {
    this.livesText.text = `Lives: ${lives}`;
  }

  private init(): void {
    this.initLives();
    this.initCurrentLevel();
    this.initScore();
  }

  private initLives(): void {
    const livesCount = GameplayConfig.lives;

    const livesText = this.livesText = new Text({
      text: `Lives: ${livesCount}`,
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    livesText.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    livesText.anchor.set(0.5);

    this.addChild(livesText);
  }

  private initCurrentLevel(): void {
    const currentLevelText = this.currentLevelText = new Text({
      text: 'Level 1',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    currentLevelText.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    currentLevelText.anchor.set(0.5);

    this.addChild(currentLevelText);
  }

  private initScore(): void {
    const scoreText = this.scoreText = new Text({
      text: 'Score: 0',
      style: {
        fontFamily: 'riky',
        fill: 0xffffff,
        fontSize: 50,
        align: 'center',
      },
    });

    scoreText.resolution = Math.min(window.devicePixelRatio, SCENE_CONFIG.maxPixelRatio);
    scoreText.anchor.set(0.5);

    this.addChild(scoreText);
  }
}