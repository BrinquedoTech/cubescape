import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import DebugConfig from "../../../Scene2/Configs/Main/DebugConfig";
import RendererStats from 'three-webgl-stats';
import Stats from 'three/addons/libs/stats.module.js';
import GUIHelper from "./GUIHelper";
import { OrbitControls } from "three/examples/jsm/Addons.js";

export default class Scene3DDebugMenu {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private pixiApp: PIXI.Application;

  private fpsStats: any;
  private rendererStats: any;
  private orbitControls: any;
  
  private _isAssetsLoaded: boolean;

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, pixiApp: PIXI.Application) {
    this.camera = camera;
    this.renderer = renderer;
    this.pixiApp = pixiApp;

    this.fpsStats = null;
    this.rendererStats = null;
    this.orbitControls = null;

    this._isAssetsLoaded = false;

    this._init();
  }

  preUpdate() {
    if (DebugConfig.fpsMeter) {
      this.fpsStats.begin();
    }
  }

  postUpdate() {
    if (DebugConfig.fpsMeter) {
      this.fpsStats.end();
    }
  }

  update() {
    if (DebugConfig.orbitControls) {
      this.orbitControls.update();
    }

    if (DebugConfig.rendererStats) {
      this.rendererStats.update(this.renderer);
    }
  }

  showAfterAssetsLoad() {
    this._isAssetsLoaded = true;

    if (DebugConfig.fpsMeter) {
      this.fpsStats.dom.style.visibility = 'visible';
    }

    if (DebugConfig.rendererStats) {
      this.rendererStats.domElement.style.visibility = 'visible';
    }

    if (DebugConfig.orbitControls) {
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
    if (DebugConfig.rendererStats) {
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
    if (DebugConfig.fpsMeter) {
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
    if (DebugConfig.fpsMeter) {
      if (!this.fpsStats) {
        this._initFPSMeter();
      }
      this.fpsStats.dom.style.display = 'block';
    } else {
      this.fpsStats.dom.style.display = 'none';
    }
  }

  onRendererStatsClick(rendererStatsState) {
    if (DebugConfig.rendererStats) {
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
