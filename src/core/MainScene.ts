import * as THREE from 'three';
import { RotateDirection, TurnDirection } from "../scene/Enums/RotateDirection";
import { ILibrariesData } from "../scene/Interfaces/ILibrariesData";
import ThreeJSScene from "../scene/ThreeJSScene";
import UI from "../UI/UI";

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
  }

  update(dt: number) {
    this.scene3D.update(dt);
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


    // this._ui.on('onPointerMove', (msg, x, y) => this._scene3D.onPointerMove(x, y));
    // this._ui.on('onPointerMove', (msg, x, y) => this._scene3D.onPointerMove(x, y));
    // this._ui.on('onPointerDown', (msg, x, y) => this._scene3D.onPointerDown(x, y));
    // this._ui.on('onPointerUp', (msg, x, y) => this._scene3D.onPointerUp(x, y));
    // this._ui.on('onWheelScroll', (msg, delta) => this._scene3D.onWheelScroll(delta));
    // this._ui.on('onSoundChanged', () => this._scene3D.onSoundChanged());

    // this._scene3D.events.on('fpsMeterChanged', () => this.events.post('fpsMeterChanged'));
    // this._scene3D.events.on('onSoundsEnabledChanged', () => this._ui.updateSoundIcon());
  }

  onResize() {
    this.ui.onResize();

  }
}
