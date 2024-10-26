import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import AbstractScreen from './AbstractScreen';

export default class GameplayScreen extends AbstractScreen {
  private score: PIXI.Text;

  constructor() {
    super();

    this.init();
  }

  public onResize(width: number, _height?: number): void {
    this.score.x = width - 130;
    this.score.y = 10;
  }

  private init(): void {
    this.initScore();
  }

  private initScore(): void {
    const score = this.score = new Text({ text: 'Score: 0', style: { fill: 0xffffff } });

    this.addChild(score);
  }
}