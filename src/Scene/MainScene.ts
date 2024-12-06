import * as THREE from 'three';
import { RotateDirection, TurnDirection } from "../Data/Enums/Cube/RotateDirection";
import UI from "../UI/UI";
import { ScreenType } from '../Data/Enums/UI/ScreenType';
import DebugConfig from '../Data/Configs/Main/DebugConfig';
import { ILevelScore } from '../Data/Interfaces/IScore';
import AudioController from './GameScene/AudioController';
import { Direction } from '../Data/Enums/Direction';
import ThreeJSScene from './ThreeJSScene';
import { ILibrariesData } from '../Data/Interfaces/IBaseSceneData';

export default class MainScene {
  private data: ILibrariesData;
  private scene: THREE.Scene;
  private scene3D: ThreeJSScene;
  private ui: UI;

  constructor(data: ILibrariesData) {
    this.data = data;
    this.scene = data.scene;

    this.init();
  }

  public afterAssetsLoad(): void {
    this.scene.add(this.scene3D);

    if (DebugConfig.gameplay.disableIntro) {
      this.scene3D.startGameWithoutIntro();
    } else {
      this.startIntro();
    }
  }

  public update(dt: number): void {
    this.scene3D.update(dt);
  }

  private startIntro(): void {
    this.ui.showScreen(ScreenType.Intro);
    this.scene3D.startIntro();
  }
  
  public onResize(): void {
    this.ui.onResize();
  }

  private init(): void {
    this.scene3D = new ThreeJSScene(this.data);
    this.initUI();

    this.initSignals();
  }

  private initUI(): void {
    const ui = this.ui = new UI();
    this.data.pixiApp.stage.addChild(ui);

    ui.onResize();
  }

  private initSignals(): void {
    this.ui.emitter.on('rotateRight', () => this.scene3D.rotateCubeToDirection(RotateDirection.Right));
    this.ui.emitter.on('rotateLeft', () => this.scene3D.rotateCubeToDirection(RotateDirection.Left));
    this.ui.emitter.on('rotateUp', () => this.scene3D.rotateCubeToDirection(RotateDirection.Up));
    this.ui.emitter.on('rotateDown', () => this.scene3D.rotateCubeToDirection(RotateDirection.Down));
    this.ui.emitter.on('rotateClockwise', () => this.scene3D.turnCubeToDirection(TurnDirection.Clockwise));
    this.ui.emitter.on('rotateCounterClockwise', () => this.scene3D.turnCubeToDirection(TurnDirection.CounterClockwise));

    this.ui.emitter.on('onStartClick', () => this.scene3D.startGame());
    this.ui.emitter.on('onNextLevelClick', () => this.scene3D.startNextLevel());
    this.ui.emitter.on('onStartAgain', () => this.scene3D.startGameAgain());
    this.ui.emitter.on('onSwipe', (direction: Direction) => this.scene3D.onSwipe(direction));

    this.scene3D.emitter.on('onPressStart', () => this.onPressStart());
    this.scene3D.emitter.on('updateLevelOnStartLevel', (levelIndex: number) => this.ui.updateLevelText(levelIndex));
    this.scene3D.emitter.on('onWinLevel', ({ levelTime, levelScore }) => this.onWinLevel(levelTime, levelScore));
    this.scene3D.emitter.on('updateScore', (score: number) => this.ui.updateScore(score));
    this.scene3D.emitter.on('updateLives', (lives: number) => this.ui.updateLives(lives));
    this.scene3D.emitter.on('onLoseGame', () => this.onLoseGame());
    this.scene3D.emitter.on('onWinGame', (score: number) => this.onWinGame(score));
  }

  private onWinLevel(levelTime: number, levelScore: ILevelScore): void {
    this.ui.setLevelTime(levelTime);
    this.ui.setScoreForLevel(levelScore);
    this.ui.showScreen(ScreenType.LevelWin);
    this.ui.hideScreen(ScreenType.Gameplay);
  }

  private onPressStart(): void {
    if (this.ui.getActiveScreen() === ScreenType.Intro) {
      this.ui.hideScreen(ScreenType.Intro);
      this.ui.showScreen(ScreenType.Gameplay);
      this.scene3D.startGame();

      setTimeout(() => {
        AudioController.getInstance().playMusic();
      }, 200);
    }

    if (this.ui.getActiveScreen() === ScreenType.LevelWin) {
      this.ui.hideScreen(ScreenType.LevelWin);
      this.ui.showScreen(ScreenType.Gameplay);
      this.scene3D.startNextLevel();
    }

    if (this.ui.getActiveScreen() === ScreenType.Lose) {
      this.ui.hideScreen(ScreenType.Lose);
      this.ui.showScreen(ScreenType.Gameplay);
      this.scene3D.startGameAgain();
    }

    if (this.ui.getActiveScreen() === ScreenType.GameWin) {
      this.ui.hideScreen(ScreenType.GameWin);
      this.ui.showScreen(ScreenType.Gameplay);
      this.scene3D.startGameAgain();
    }
  }

  private onLoseGame(): void {
    this.ui.showScreen(ScreenType.Lose);
    this.ui.hideScreen(ScreenType.Gameplay);
  }

  private onWinGame(score: number): void {
    this.ui.setOverallScore(score);
    this.ui.showScreen(ScreenType.GameWin);
    this.ui.hideScreen(ScreenType.Gameplay);
  }
}
