import Scene3D from "./scene/scene3d";
import UI from "./ui/ui";


export default class MainScene {
  private data: any;
  private scene: any;
  private camera: any;
  private scene3D: Scene3D;
  private ui: UI;

  constructor(data: any) {
    this.data = data;
    this.scene = data.scene;
    this.camera = data.camera;

    this._init();
  }

  afterAssetsLoad() {

    this.scene.add(this.scene3D);
  }

  update(dt: number) {
    this.scene3D.update(dt);
  }

  _init() {
    this.scene3D = new Scene3D(this.data);
    this._initUI();

    this._initSignals();
  }

  _initUI() {
    const ui = this.ui = new UI();
    this.data.pixiApp.stage.addChild(ui);

    ui.onResize();
  }

  _initSignals() {

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
