import * as THREE from 'three';
import GameScene from './GameScene/GameScene';
import { RotateDirection, TurnDirection } from './Enums/RotateDirection';
import { ILibrariesData } from './Interfaces/ILibrariesData';
import mitt, { Emitter } from 'mitt';
import { ILevelScore } from './Interfaces/IScore';

type Events = {
  onWinLevel: { levelTime: number; levelScore: ILevelScore };
  onPressStart: void;
  updateLevelOnStartLevel: number;
  updateScore: number;
  updateLives: number;
  onLoseGame: void;
  onWinGame: number;
};

export default class ThreeJSScene extends THREE.Group {
  // private data: any;
  // private scene: any;
  private camera: THREE.PerspectiveCamera;
  private gameScene: GameScene;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor(data: ILibrariesData) {
    super();

    // this.data = data,
    // this.scene = data.scene,
    this.camera = data.camera,

    this.init();
  }

  public update(dt: number): void {
    if (dt > 0.1) {
      dt = 0.1;
    }

    this.gameScene.update(dt);
  }

  // onPointerMove(x, y) {
  // }

  // onPointerDown(x, y) {
  // }

  // onPointerUp(x, y) 
  // }

  public rotateCubeToDirection(rotateDirection: RotateDirection): void {
    this.gameScene.rotateCube(rotateDirection);
  }

  public turnCubeToDirection(turnDirection: TurnDirection): void {
    this.gameScene.turnCube(turnDirection);
  }

  public startGame(): void {
    this.gameScene.startGame();
  }

  public startGameAgain(): void {
    this.gameScene.startGameAgain();
  }

  public startNextLevel(): void {
    this.gameScene.startNextLevel();
  }

  public startIntro(): void {
    this.gameScene.startIntro();
  }

  public startGameWithoutIntro(): void {
    this.gameScene.startGameWithoutIntro();
  }

  private init(): void {
    const gameScene = this.gameScene = new GameScene(this.camera);
    this.add(gameScene);

    gameScene.emitter.on('onPressStart', () => this.emitter.emit('onPressStart'));
    gameScene.emitter.on('updateLevelOnStartLevel', (levelIndex: number) => this.emitter.emit('updateLevelOnStartLevel', levelIndex));
    gameScene.emitter.on('onWinLevel', ({ levelTime, levelScore }) => this.emitter.emit('onWinLevel', { levelTime, levelScore }));
    gameScene.emitter.on('updateScore', (score: number) => this.emitter.emit('updateScore', score));
    gameScene.emitter.on('updateLives', (lives: number) => this.emitter.emit('updateLives', lives));
    gameScene.emitter.on('onLoseGame', () => this.emitter.emit('onLoseGame'));
    gameScene.emitter.on('onWinGame', (score: number) => this.emitter.emit('onWinGame', score ));
  }
}
