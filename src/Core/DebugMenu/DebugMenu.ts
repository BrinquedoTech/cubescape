import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import RendererStats from 'three-webgl-stats';
import Stats from 'three/addons/libs/stats.module.js';
import GUIHelper from "./GUIHelper";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';

export default class DebugMenu {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private pixiApp: PIXI.Application;

  private fpsStats: Stats;
  private rendererStats: RendererStats;
  private orbitControls: OrbitControls;
  
  private isAssetsLoaded: boolean;

  constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, pixiApp: PIXI.Application) {
    this.camera = camera;
    this.renderer = renderer;
    this.pixiApp = pixiApp;

    this.isAssetsLoaded = false;

    this.init();
  }

  public preUpdate(): void {
    if (DebugConfig.fpsMeter) {
      this.fpsStats.begin();
    }
  }

  public postUpdate(): void {
    if (DebugConfig.fpsMeter) {
      this.fpsStats.end();
    }
  }

  public update(): void {
    if (DebugConfig.orbitControls) {
      this.orbitControls.update();
    }

    if (DebugConfig.rendererStats) {
      this.rendererStats.update(this.renderer);
    }
  }

  public showAfterAssetsLoad(): void {
    this.isAssetsLoaded = true;

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

  public getOrbitControls(): OrbitControls {
    return this.orbitControls;
  }

  private init(): void {
    this.initRendererStats();
    this.initFPSMeter();
    this.initOrbitControls();

    this.initLilGUIHelper();
  }

  private initRendererStats(): void {
    if (DebugConfig.rendererStats) {
      const rendererStats = this.rendererStats = new RendererStats();

      rendererStats.domElement.style.position = 'absolute';
      rendererStats.domElement.style.left = '0px';
      rendererStats.domElement.style.bottom = '0px';
      document.body.appendChild(rendererStats.domElement);

      if (!this.isAssetsLoaded) {
        this.rendererStats.domElement.style.visibility = 'hidden';
      }
    }
  }

  private initFPSMeter(): void {
    if (DebugConfig.fpsMeter) {
      const stats = this.fpsStats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);

      if (!this.isAssetsLoaded) {
        this.fpsStats.dom.style.visibility = 'hidden';
      }
    }
  }

  private initOrbitControls(): void {
    const orbitControls = this.orbitControls = new OrbitControls(this.camera, this.pixiApp.renderer.canvas);

    orbitControls.target.set(0, 0, 0);

    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.07;
    orbitControls.rotateSpeed = 1;
    orbitControls.panSpeed = 1;

    if (!this.isAssetsLoaded) {
      orbitControls.enabled = false;
    }
  }

  private initLilGUIHelper(): void {
    new GUIHelper();
  }

  // private onFpsMeterClick(): void {
  //   if (DebugConfig.fpsMeter) {
  //     if (!this.fpsStats) {
  //       this.initFPSMeter();
  //     }
  //     this.fpsStats.dom.style.display = 'block';
  //   } else {
  //     this.fpsStats.dom.style.display = 'none';
  //   }
  // }

  // private onRendererStatsClick(rendererStatsState): void {
  //   if (DebugConfig.rendererStats) {
  //     if (rendererStatsState) {
  //       if (!this.rendererStats) {
  //         this.initRendererStats();
  //       }

  //       this.rendererStats.domElement.style.display = 'block';
  //     } else {
  //       this.rendererStats.domElement.style.display = 'none';
  //     }
  //   }
  // }

  // private onOrbitControlsClick(orbitControlsState): void {
  //   if (orbitControlsState) {
  //     if (!this.orbitControls) {
  //       this.initOrbitControls();
  //     }

  //     this.orbitControls.enabled = true;
  //   } else {
  //     this.orbitControls.enabled = false;
  //   }
  // }
}
