import * as PIXI from 'pixi.js';
import GameplayScreen from './Screens/GameplayScreen';
import LevelWinScreen from './Screens/LevelWinScreen';
import mitt, { Emitter } from 'mitt';
import { ScreenType } from '../scene/Enums/UI/ScreenType';
import AbstractScreen from './Screens/AbstractScreen';
import IntroScreen from './Screens/IntroScreen';

type Events = {
  onStartClick: string;
  onNextLevelClick: string;
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

  private init(): void {
    this.initIntroScreen();
    this.initGameplayScreen();
    this.initLevelWinScreen();

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

  private initSignals(): void {
    const gameplayScreen = this.screens[ScreenType.Gameplay] as GameplayScreen;
    const levelWinScreen = this.screens[ScreenType.LevelWin] as LevelWinScreen;
    const introScreen = this.screens[ScreenType.Intro] as IntroScreen;

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
  }
}