import * as THREE from 'three';
import { RotateDirection, TurnDirection } from '../../../Data/Enums/Cube/RotateDirection';
import CubeRotationController from './CubeRotationController';
import { CubeSide } from '../../../Data/Enums/Cube/CubeSide';
import { CubeRotationDirection } from '../../../Data/Enums/Cube/CubeRotationDirection';
import { CubeState } from '../../../Data/Enums/Cube/CubeState';
import CubeDebug from './CubeDebug';
import mitt, { Emitter } from 'mitt';
import { DefaultStartSideConfig } from '../../../Data/Configs/StartSideConfig';
import CubeViewBuilder from './CubeViewBuilder';
import TWEEN from 'three/addons/libs/tween.module.js';
import CubeIntroRotationController from './CubeIntroRotationController';
import { ILevelConfig } from '../../../Data/Interfaces/ILevelConfig';

type Events = {
  endRotating: string;
  endRotatingOnRespawn: string;
  winAnimationEnd: string;
  startLevelAnimationEnd: string;
  endIntroRotation: string;
};

export default class Cube extends THREE.Group {
  private levelConfig: ILevelConfig;
  private cubeViewBuilder: CubeViewBuilder;
  private cubeRotationController: CubeRotationController;
  private cubeIntroRotationController: CubeIntroRotationController;
  private cubeDebug: CubeDebug;
  private state: CubeState = CubeState.Idle;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.initCubeViewBuilder();
    this.initCubeRotationController();
    this.initCubeIntroRotationController();
    this.initCubeDebug();

    this.hide();
  }

  public update(dt: number): void {
    this.cubeRotationController.update(dt);
    this.cubeIntroRotationController.update(dt);
  }

  public rotateToDirection(rotateDirection: RotateDirection): void {
    this.state = CubeState.Rotating;
    this.cubeRotationController.rotateToDirection(rotateDirection);
  }

  public turn(turnDirection: TurnDirection): void {
    this.state = CubeState.Rotating;
    this.cubeRotationController.turn(turnDirection);
  }

  public rotateToStartSide(): void {
    this.state = CubeState.Rotating;
    this.cubeRotationController.rotateToStartSide();
  }

  public getCurrentSide(): CubeSide {
    return this.cubeRotationController.getCurrentSide();
  }

  public getCurrentRotationDirection(): CubeRotationDirection {
    return this.cubeRotationController.getCurrentRotationDirection();
  }

  public getSideAfterRotation(rotateDirection: RotateDirection): CubeSide {
    return this.cubeRotationController.getSideAfterRotation(rotateDirection);
  }

  public getState(): CubeState {
    return this.state;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.cubeViewBuilder.init(levelConfig);
    this.setStartSide();
    this.show();
    
    this.cubeDebug.setLevelConfig(levelConfig);
  }

  public reset(): void {
    this.levelConfig = null;
    this.state = CubeState.Idle;
    this.cubeRotationController.reset();
  }

  public removeCube(): void {
    this.cubeViewBuilder.removeView();
    this.cubeDebug.removeDebug();
  }

  public winLevelAnimation(): void {
    new TWEEN.Tween(this.scale)
      .to({ x: 0, y: 0, z: 0 }, 500)
      .easing(TWEEN.Easing.Back.In)
      .start()
      .onComplete(() => {
        this.emitter.emit('winAnimationEnd');
      });
  }

  public showStartLevelAnimation(): void {
    this.visible = true;
    this.scale.set(0, 0, 0);

    new TWEEN.Tween(this.scale)
      .to({ x: 1, y: 1, z: 1 }, 500)
      .easing(TWEEN.Easing.Back.Out)
      .start()
      .onComplete(() => {
        this.emitter.emit('startLevelAnimationEnd');
      });
  }

  public startIntroAnimation(): void {
    this.cubeIntroRotationController.start();
  }

  public stopIntroAnimation(): void {
    this.cubeIntroRotationController.stop();
  }

  public getIntroActive(): boolean {
    return this.cubeIntroRotationController.getActive();
  }

  private initCubeViewBuilder(): void {
    const cubeViewBuilder = this.cubeViewBuilder = new CubeViewBuilder();
    this.add(cubeViewBuilder);
  }

  private initCubeRotationController(): void {
    this.cubeRotationController = new CubeRotationController(this);

    this.cubeRotationController.emitter.on('endRotating', () => {
      this.state = CubeState.Idle;
      this.emitter.emit('endRotating');
    });

    this.cubeRotationController.emitter.on('endRotatingOnRespawn', () => {
      this.state = CubeState.Idle;
      this.emitter.emit('endRotatingOnRespawn');
    });
  }

  private initCubeIntroRotationController(): void {
    this.cubeIntroRotationController = new CubeIntroRotationController(this);

    this.cubeIntroRotationController.emitter.on('onStop', () => {
      this.emitter.emit('endIntroRotation');
    });
  }

  private initCubeDebug(): void {
    const cubeDebug = this.cubeDebug = new CubeDebug();
    this.add(cubeDebug);
  }

  private setStartSide(): void {
    const defaultSide: CubeSide = DefaultStartSideConfig.side;
    const defaultRotationDirection: CubeRotationDirection = DefaultStartSideConfig.rotationDirection;

    let startSide: CubeSide = defaultSide;
    let startCubeRotationDirection: CubeRotationDirection = defaultRotationDirection;

    if (this.levelConfig.startSide) {
      startSide = this.levelConfig.startSide.side ?? defaultSide;
      startCubeRotationDirection = this.levelConfig.startSide.rotationDirection ?? defaultRotationDirection;
    }

    this.cubeRotationController.setInitRotation(startSide, startCubeRotationDirection);
  }
}
