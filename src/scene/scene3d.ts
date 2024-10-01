import * as THREE from 'three';
import GameScene from './GameScene/GameScene';
import { RotateDirection } from './Enums/RotateDirection';

export default class Scene3D extends THREE.Group {
  private data: any;
  private scene: any;
  private camera: any;
  private gameScene: any;

  constructor(data) {
    super();

    this.data = data,
    this.scene = data.scene,
    this.camera = data.camera,

    this.init();
  }

  public update(dt: number): void {
    this.gameScene.update(dt);
  }

  onPointerMove(x, y) {
  }

  onPointerDown(x, y) {
  }

  onPointerUp(x, y) {
  }

  public rotateCubeToDirection(rotateDirection: RotateDirection): void {
    this.gameScene.rotateCubeToDirection(rotateDirection);
  }


  private init(): void {
    this.gameScene = new GameScene();
    this.add(this.gameScene);
  }
}
