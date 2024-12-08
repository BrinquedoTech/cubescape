import * as PIXI from 'pixi.js';
import mitt, { Emitter } from 'mitt';
import AbstractScreen from './ScreensByType/AbstractScreen';
import { ScreenType } from '../../../Data/Enums/UI/ScreenType';
import { ILevelScore } from '../../../Data/Interfaces/IScore';
import IntroScreen from './ScreensByType/IntroScreen';
import GameplayScreen from './ScreensByType/GameplayScreen';
import LevelWinScreen from './ScreensByType/LevelWinScreen';
import GameWinScreen from './ScreensByType/GameWinScreen';
import LoseScreen from './ScreensByType/LoseScreen';

type Events = {
  onStartClick: void;
  onNextLevelClick: void;
  onStartAgain: void;
};

export default class ScreensController extends PIXI.Container {
  private screens: { [key in ScreenType]?: AbstractScreen } = {};
  private activeScreen: ScreenType;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.init();
  }

  public onResize(width: number, height: number): void {
    for (const screen of Object.values(this.screens)) {
      screen.onResize(width, height);
    }
  }

  public showScreen(screenType: ScreenType): void {
    this.screens[screenType].show();
    this.activeScreen = screenType;
  }

  public hideScreen(screenType: ScreenType): void {
    this.screens[screenType].hide();
  }

  public getActiveScreen(): ScreenType {
    return this.activeScreen;
  }

  public updateLevelText(level: number): void {
    const gameplayScreen = this.screens[ScreenType.Gameplay] as GameplayScreen;
    gameplayScreen.updateLevelText(level);
  }

  public updateScore(score: number): void {
    const gameplayScreen = this.screens[ScreenType.Gameplay] as GameplayScreen;
    gameplayScreen.updateScore(score);
  }

  public updateLives(lives: number): void {
    const gameplayScreen = this.screens[ScreenType.Gameplay] as GameplayScreen;
    gameplayScreen.updateLives(lives);
  }

  public setLevelTime(time: number): void {
    const gameplayScreen = this.screens[ScreenType.LevelWin] as LevelWinScreen;
    gameplayScreen.setLevelTime(time);
  }

  public setScoreForLevel(score: ILevelScore): void {
    const levelWinScreen = this.screens[ScreenType.LevelWin] as LevelWinScreen;
    levelWinScreen.setScoreForLevel(score);
  }

  public setOverallScore(score: number): void {
    const gameWinScreen = this.screens[ScreenType.GameWin] as GameWinScreen;
    gameWinScreen.setOverallScore(score);
  }

  private init(): void {
    this.initIntroScreen();
    this.initGameplayScreen();
    this.initLevelWinScreen();
    this.initLoseScreen();
    this.initGameWinScreen();

    this.initSignals();
  }

  private initIntroScreen(): void {
    const introScreen = new IntroScreen();
    this.addChild(introScreen);

    introScreen.hide(true);

    this.screens[ScreenType.Intro] = introScreen;
  }

  private initGameplayScreen(): void {
    const gameplayScreen = new GameplayScreen();
    this.addChild(gameplayScreen);

    gameplayScreen.hide(true);

    this.screens[ScreenType.Gameplay] = gameplayScreen;
  }

  private initLevelWinScreen(): void {
    const levelWinScreen = new LevelWinScreen();
    this.addChild(levelWinScreen);

    levelWinScreen.hide(true);

    this.screens[ScreenType.LevelWin] = levelWinScreen;
  }

  private initLoseScreen(): void {
    const loseScreen = new LoseScreen();
    this.addChild(loseScreen);

    loseScreen.hide(true);

    this.screens[ScreenType.Lose] = loseScreen;
  }

  private initGameWinScreen(): void {
    const gameWinScreen = new GameWinScreen();
    this.addChild(gameWinScreen);
    gameWinScreen.hide(true);

    this.screens[ScreenType.GameWin] = gameWinScreen;
  }

  private initSignals(): void {
    const gameplayScreen = this.screens[ScreenType.Gameplay] as GameplayScreen;
    const levelWinScreen = this.screens[ScreenType.LevelWin] as LevelWinScreen;
    const introScreen = this.screens[ScreenType.Intro] as IntroScreen;
    const loseScreen = this.screens[ScreenType.Lose] as LoseScreen;
    const gameWinScreen = this.screens[ScreenType.GameWin] as GameWinScreen;

    levelWinScreen.emitter.on('onNextLevelClick', () => {
      this.emitter.emit('onNextLevelClick');
      levelWinScreen.hide();
      gameplayScreen.show();
    });

    introScreen.emitter.on('onStartClick', () => {
      this.emitter.emit('onStartClick');
      introScreen.hide();
      gameplayScreen.show();
    });

    loseScreen.emitter.on('onStartAgain', () => {
      this.emitter.emit('onStartAgain');
      loseScreen.hide();
      gameplayScreen.show();
    });

    gameWinScreen.emitter.on('onStartAgain', () => {
      this.emitter.emit('onStartAgain');
      gameWinScreen.hide();
      gameplayScreen.show();
    });
  }
}