import * as THREE from 'three';
import GameScene from './GameScene/GameScene';
import { RotateDirection, TurnDirection } from './Enums/RotateDirection';
import { ILibrariesData } from './Interfaces/ILibrariesData';
import mitt, { Emitter } from 'mitt';

type Events = {
  onWinLevel: string;
  onPressStart: string;
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

  public startNextLevel(): void {
    this.gameScene.startNextLevel();
  }

  public startIntro(): void {
    this.gameScene.startIntro();
  }

  private init(): void {
    const gameScene = this.gameScene = new GameScene(this.camera);
    this.add(gameScene);

    gameScene.emitter.on('onWinLevel', () => this.emitter.emit('onWinLevel'));
    gameScene.emitter.on('onPressStart', () => this.emitter.emit('onPressStart'));
  }
}
