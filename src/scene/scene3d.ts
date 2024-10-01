import * as THREE from 'three';
import GameScene from './GameScene/GameScene';

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

  update(dt) {
  }

  onPointerMove(x, y) {
  }

  onPointerDown(x, y) {
  }

  onPointerUp(x, y) {
  }


  private init(): void {
    this.gameScene = new GameScene();
    this.add(this.gameScene);
  }
}
