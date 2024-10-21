import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { RotateDirection, TurnDirection } from '../../Enums/RotateDirection';
import CubeRotationController from './CubeRotationController';
import { CubeSide } from '../../Enums/CubeSide';
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';
import { CubeState } from '../../Enums/CubeState';
import CubeDebug from './CubeDebug';
import mitt, { Emitter } from 'mitt';
import { DefaultStartSideConfig } from '../../Configs/StartSideConfig';
import CubeViewBuilder from './CubeViewBuilder';

type Events = {
  endRotating: string;
  endRotatingOnRespawn: string;
};

export default class Cube extends THREE.Group {
  private levelConfig: ILevelConfig;
  private cubeViewBuilder: CubeViewBuilder;
  private cubeRotationController: CubeRotationController;
  private cubeDebug: CubeDebug;
  private state: CubeState = CubeState.Idle;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.initCubeViewBuilder();
    this.initCubeRotationController();
    this.initCubeDebug();

    this.hide();
  }

  public update(dt: number): void {
    this.cubeRotationController.update(dt);
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
