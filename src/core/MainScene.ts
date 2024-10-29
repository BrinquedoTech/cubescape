import * as THREE from 'three';
import { RotateDirection, TurnDirection } from "../scene/Enums/RotateDirection";
import { ILibrariesData } from "../scene/Interfaces/ILibrariesData";
import ThreeJSScene from "../scene/ThreeJSScene";
import UI from "../UI/UI";
import { ScreenType } from '../scene/Enums/UI/ScreenType';
import DebugConfig from '../scene/Configs/Main/DebugConfig';
import { ILevelScore } from '../scene/Interfaces/IScore';

export default class MainScene {
  private data: ILibrariesData;
  private scene: THREE.Scene;
  // private camera: THREE.PerspectiveCamera;
  private scene3D: ThreeJSScene;
  private ui: UI;

  constructor(data: ILibrariesData) {
    this.data = data;
    this.scene = data.scene;
    // this.camera = data.camera;

    this._init();
  }

  afterAssetsLoad() {
    this.scene.add(this.scene3D);

    if (DebugConfig.gameplay.disableIntro) {
      this.scene3D.startGameWithoutIntro();
    } else {
      this.startIntro();
    }
  }

  update(dt: number) {
    this.scene3D.update(dt);
  }

  private startIntro() {
    this.ui.showScreen(ScreenType.Intro);
    this.scene3D.startIntro();
  }

  _init() {
    this.scene3D = new ThreeJSScene(this.data);
    this._initUI();

    this._initSignals();
  }

  _initUI() {
    const ui = this.ui = new UI();
    this.data.pixiApp.stage.addChild(ui);

    ui.onResize();
  }

  _initSignals() {
    this.ui.emitter.on('rotateRight', () => this.scene3D.rotateCubeToDirection(RotateDirection.Right));
    this.ui.emitter.on('rotateLeft', () => this.scene3D.rotateCubeToDirection(RotateDirection.Left));
    this.ui.emitter.on('rotateUp', () => this.scene3D.rotateCubeToDirection(RotateDirection.Up));
    this.ui.emitter.on('rotateDown', () => this.scene3D.rotateCubeToDirection(RotateDirection.Down));
    this.ui.emitter.on('rotateClockwise', () => this.scene3D.turnCubeToDirection(TurnDirection.Clockwise));
    this.ui.emitter.on('rotateCounterClockwise', () => this.scene3D.turnCubeToDirection(TurnDirection.CounterClockwise));

    this.ui.emitter.on('onStartClick', () => this.scene3D.startGame());
    this.ui.emitter.on('onNextLevelClick', () => this.scene3D.startNextLevel());
    this.ui.emitter.on('onStartAgain', () => this.scene3D.startGameAgain());

    this.scene3D.emitter.on('onPressStart', () => this.onPressStart());
    this.scene3D.emitter.on('updateLevelOnStartLevel', (levelIndex: number) => this.ui.updateLevelText(levelIndex));
    this.scene3D.emitter.on('onWinLevel', ({ levelTime, levelScore }) => this.onWinLevel(levelTime, levelScore));
    this.scene3D.emitter.on('updateScore', (score: number) => this.ui.updateScore(score));
    this.scene3D.emitter.on('updateLives', (lives: number) => this.ui.updateLives(lives));
    this.scene3D.emitter.on('onLoseGame', () => this.onLoseGame());
    this.scene3D.emitter.on('onWinGame', (score: number) => this.onWinGame(score));


    // this._ui.on('onPointerMove', (msg, x, y) => this._scene3D.onPointerMove(x, y));
    // this._ui.on('onPointerMove', (msg, x, y) => this._scene3D.onPointerMove(x, y));
    // this._ui.on('onPointerDown', (msg, x, y) => this._scene3D.onPointerDown(x, y));
    // this._ui.on('onPointerUp', (msg, x, y) => this._scene3D.onPointerUp(x, y));
    // this._ui.on('onWheelScroll', (msg, delta) => this._scene3D.onWheelScroll(delta));
    // this._ui.on('onSoundChanged', () => this._scene3D.onSoundChanged());

    // this._scene3D.events.on('fpsMeterChanged', () => this.events.post('fpsMeterChanged'));
    // this._scene3D.events.on('onSoundsEnabledChanged', () => this._ui.updateSoundIcon());
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

  onResize() {
    this.ui.onResize();
  }
}
