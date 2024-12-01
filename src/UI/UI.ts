import * as PIXI from 'pixi.js';
import mitt, { Emitter } from 'mitt';
import RotateButtons from './RotateButtons';
import DebugConfig from '../Scene2/Configs/Main/DebugConfig';
import ScreensController from './ScreensController';
import { ScreenType } from '../Scene2/Enums/UI/ScreenType';
import { ILevelScore } from '../Scene2/Interfaces/IScore';
import MuteButton from './MuteButton';
import SwipeController from './SwipeController';
import { Direction } from '../Scene2/Enums/Direction';

type Events = {
  rotateRight: string;
  rotateLeft: string;
  rotateUp: string;
  rotateDown: string;
  rotateClockwise: string;
  rotateCounterClockwise: string;
  onStartClick: string;
  onNextLevelClick: string;
  onStartAgain: string;
  onSwipe: Direction;
};

export default class UI extends PIXI.Container {
  private screensController: ScreensController;
  private rotateButtons: RotateButtons;
  private muteButton: MuteButton;
  private isMobile: boolean;
  private swipeController: SwipeController;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.isMobile = PIXI.isMobile.any;

    this.init();
  }

  public onResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.isMobile) {
      this.muteButton.x = 35;
      this.muteButton.y = 35;
    } else {
      this.muteButton.x = 50;
      this.muteButton.y = 50;
    }

    this.screensController.onResize(width, height);

    if (DebugConfig.gameplay.cubeRotationButtons) {
      this.rotateButtons.onResize();

      this.rotateButtons.x = width * 0.5;
      this.rotateButtons.y = height * 0.5;
    }

    if (this.swipeController) {
      this.swipeController.onResize(width, height);
    }
  }

  public showScreen(screenType: ScreenType): void {
    this.screensController.showScreen(screenType);
  }

  public hideScreen(screenType: ScreenType): void {
    this.screensController.hideScreen(screenType);
  }

  public getActiveScreen(): ScreenType {
    return this.screensController.getActiveScreen();
  }

  public updateLevelText(level: number): void {
    this.screensController.updateLevelText(level);
  }

  public updateScore(score: number): void {
    this.screensController.updateScore(score);
  }

  public updateLives(lives: number): void {
    this.screensController.updateLives(lives);
  }

  public setLevelTime(time: number): void {
    this.screensController.setLevelTime(time);
  }

  public setScoreForLevel(score: ILevelScore): void {
    this.screensController.setScoreForLevel(score);
  }

  public setOverallScore(score: number): void {
    this.screensController.setOverallScore(score);
  }

  private init(): void {
    this.initSwipeController();
    this.initMuteButton();
    this.initScreensController();
    this.initDebugRotateButtons();
  }

  private initMuteButton(): void {
    const muteButton = this.muteButton = new MuteButton();
    this.addChild(muteButton);
  }

  private initScreensController(): void {
    const screensController = this.screensController = new ScreensController();
    this.addChild(screensController);
  }

  private initSwipeController(): void {
    if (this.isMobile) {
      const swipeController = this.swipeController = new SwipeController();
      this.addChild(swipeController);
  
      swipeController.emitter.on('onSwipe', (direction: Direction) => {
        this.emitter.emit('onSwipe', direction);
      });
    }
  }

  private initDebugRotateButtons(): void {
    if (DebugConfig.gameplay.cubeRotationButtons) {
      const rotateButtons = this.rotateButtons = new RotateButtons();
      this.addChild(rotateButtons);
  
      rotateButtons.emitter.on('rotateRight', () => this.emitter.emit('rotateRight'));
      rotateButtons.emitter.on('rotateLeft', () => this.emitter.emit('rotateLeft'));
      rotateButtons.emitter.on('rotateUp', () => this.emitter.emit('rotateUp'));
      rotateButtons.emitter.on('rotateDown', () => this.emitter.emit('rotateDown'));
      rotateButtons.emitter.on('rotateClockwise', () => this.emitter.emit('rotateClockwise'));
      rotateButtons.emitter.on('rotateCounterClockwise', () => this.emitter.emit('rotateCounterClockwise'));
    }

    this.screensController.emitter.on('onStartClick', () => this.emitter.emit('onStartClick'));
    this.screensController.emitter.on('onNextLevelClick', () => this.emitter.emit('onNextLevelClick'));
    this.screensController.emitter.on('onStartAgain', () => this.emitter.emit('onStartAgain'));
  }
}
