import DEBUG_CONFIG from "../../configs/debug-config";
import RendererStats from 'three-webgl-stats';
import Stats from 'three/addons/libs/stats.module.js';
import GUIHelper from "./gui-helper";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Scene3DDebugMenu {
  // private scene: any;
  private camera: any;
  private renderer: any;
  private pixiApp: any;

  private fpsStats: any;
  private rendererStats: any;
  private orbitControls: any;
  // private gridHelper: any;
  // private axesHelper: any;
  // private baseGUI: any;
  
  private _isAssetsLoaded: boolean;

  constructor(camera, renderer, pixiApp) {
    // this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.pixiApp = pixiApp;

    this.fpsStats = null;
    this.rendererStats = null;
    this.orbitControls = null;
    // this.gridHelper = null;
    // this.axesHelper = null;
    // this.baseGUI = null;

    this._isAssetsLoaded = false;

    this._init();
  }

  preUpdate() {
    if (DEBUG_CONFIG.fpsMeter) {
      this.fpsStats.begin();
    }
  }

  postUpdate() {
    if (DEBUG_CONFIG.fpsMeter) {
      this.fpsStats.end();
    }
  }

  update() {
    if (DEBUG_CONFIG.orbitControls) {
      this.orbitControls.update();
    }

    if (DEBUG_CONFIG.rendererStats) {
      this.rendererStats.update(this.renderer);
    }
  }

  showAfterAssetsLoad() {
    this._isAssetsLoaded = true;

    if (DEBUG_CONFIG.fpsMeter) {
      this.fpsStats.dom.style.visibility = 'visible';
    }

    if (DEBUG_CONFIG.rendererStats) {
      this.rendererStats.domElement.style.visibility = 'visible';
    }

    if (DEBUG_CONFIG.orbitControls) {
      this.orbitControls.enabled = true;
    }

    GUIHelper.instance.showAfterAssetsLoad();
  }

  getOrbitControls() {
    return this.orbitControls;
  }

  _init() {
    this._initRendererStats();
    this._initFPSMeter();
    this._initOrbitControls();

    this._initLilGUIHelper();
  }

  _initRendererStats() {
    if (DEBUG_CONFIG.rendererStats) {
      const rendererStats = this.rendererStats = new RendererStats();

      rendererStats.domElement.style.position = 'absolute';
      rendererStats.domElement.style.left = '0px';
      rendererStats.domElement.style.bottom = '0px';
      document.body.appendChild(rendererStats.domElement);

      if (!this._isAssetsLoaded) {
        this.rendererStats.domElement.style.visibility = 'hidden';
      }
    }
  }

  _initFPSMeter() {
    if (DEBUG_CONFIG.fpsMeter) {
      const stats = this.fpsStats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);

      if (!this._isAssetsLoaded) {
        this.fpsStats.dom.style.visibility = 'hidden';
      }
    }
  }

  _initOrbitControls() {
    const orbitControls = this.orbitControls = new OrbitControls(this.camera, this.pixiApp.renderer.canvas);

    orbitControls.target.set(0, 0, 0);

    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.07;
    orbitControls.rotateSpeed = 1;
    orbitControls.panSpeed = 1;

    if (!this._isAssetsLoaded) {
      orbitControls.enabled = false;
    }
  }

  _initLilGUIHelper() {
    new GUIHelper();
  }

  onFpsMeterClick() {
    if (DEBUG_CONFIG.fpsMeter) {
      if (!this.fpsStats) {
        this._initFPSMeter();
      }
      this.fpsStats.dom.style.display = 'block';
    } else {
      this.fpsStats.dom.style.display = 'none';
    }
  }

  onRendererStatsClick(rendererStatsState) {
    if (DEBUG_CONFIG.rendererStats) {
      if (rendererStatsState) {
        if (!this.rendererStats) {
          this._initRendererStats();
        }

        this.rendererStats.domElement.style.display = 'block';
      } else {
        this.rendererStats.domElement.style.display = 'none';
      }
    }
  }

  onOrbitControlsClick(orbitControlsState) {
    if (orbitControlsState) {
      if (!this.orbitControls) {
        this._initOrbitControls();
      }

      this.orbitControls.enabled = true;
    } else {
      this.orbitControls.enabled = false;
    }
  }
}
