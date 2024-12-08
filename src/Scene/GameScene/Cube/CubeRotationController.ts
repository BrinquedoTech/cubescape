import * as THREE from 'three';
import { RotateDirection, TurnDirection } from "../../../Data/Enums/Cube/RotateDirection";
import TWEEN from 'three/addons/libs/tween.module.js';
import GameplayConfig from '../../../Data/Configs/GameplayConfig';
import { CubeSide } from '../../../Data/Enums/Cube/CubeSide';
import { LocalEdgeDirections, NeighboringSidesConfig, SideVectorConfig } from '../../../Data/Configs/Cube/SideConfig';
import { CubeRotationDirection } from '../../../Data/Enums/Cube/CubeRotationDirection';
import mitt, { Emitter } from 'mitt';
import { RotationBySideConfig, TurnBySideConfig } from '../../../Data/Configs/Cube/StartSideConfig';
import { CubeRotationAngle, RotationAxisConfig, RotationDirectionsFromSideToSideConfig, TurnDirectionForRotationConfig } from '../../../Data/Configs/Cube/CubeRotationConfig';
import { CubeRotationType } from '../../../Data/Enums/Cube/CubeRotationType';
import { CubeRotationAngleType } from '../../../Data/Enums/Cube/CubeRotationAngleType';
import { IRotationAxisConfig } from '../../../Data/Interfaces/ICubeRotationConfig';

type Events = {
  endRotating: string;
  endRotatingOnRespawn: string;
};

export default class CubeRotationController {
  private object: THREE.Object3D;
  private rotationDirection: RotateDirection;
  private turnDirection: TurnDirection;
  private rotationProgress: number;
  private rotationSpeed: number;
  private isRotating: boolean;
  private lastEasedAngle: number;
  private rotationAngle: number;
  private currentSide: CubeSide = CubeSide.Front;
  private currentRotationDirection: CubeRotationDirection = CubeRotationDirection.Top;

  private initCubeSide: CubeSide;
  private initCubeRotationDirection: CubeRotationDirection;
  private waitingForRotationOnRespawn: boolean = false;
  private waitingForTurnOnRespawn: boolean = false;
  private respawnTurnDirections: TurnDirection[] = [];
  private rotationType: CubeRotationType = CubeRotationType.Regular;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor(object: THREE.Object3D) {
    this.object = object;

    this.rotationDirection = null;
    this.turnDirection = null;
    this.isRotating = false;
    this.rotationProgress = 0;
    this.lastEasedAngle = 0;
    this.rotationType = CubeRotationType.Regular;
    this.rotationAngle = CubeRotationAngle[CubeRotationAngleType.Angle90]
    this.rotationSpeed = GameplayConfig.cube.rotationSpeed[this.rotationType][CubeRotationAngleType.Angle90];
  }

  public update(dt: number): void {
    if (this.isRotating) {
      this.rotationProgress += dt * this.rotationSpeed;
      this.rotationProgress = Math.min(this.rotationProgress, 1);

      const easedProgress = TWEEN.Easing.Back.Out(this.rotationProgress);
      const targetAngle = this.rotationAngle * easedProgress;
      const deltaAngle = targetAngle - this.lastEasedAngle;

      if (this.rotationDirection) {
        this.applyRotationByDirection(deltaAngle);
      }

      if (this.turnDirection) {
        this.applyTurnByDirection(deltaAngle);
      }

      this.lastEasedAngle = targetAngle;

      if (this.rotationProgress >= 1) {
        this.onEndRotating();
        this.emitter.emit('endRotating');

        this.checkRotationOnRespawn();

        if (!this.waitingForRotationOnRespawn && !this.waitingForTurnOnRespawn) {
          this.resetRotationType();
        }
      }
    }
  }

  public reset(): void {
    this.rotationDirection = null;
    this.turnDirection = null;
    this.isRotating = false;
    this.rotationProgress = 0;
    this.lastEasedAngle = 0;
    this.currentSide = CubeSide.Front;
    this.currentRotationDirection = CubeRotationDirection.Top;
    this.waitingForRotationOnRespawn = false;
    this.waitingForTurnOnRespawn = false;
    this.respawnTurnDirections = [];
    this.rotationType = CubeRotationType.Regular;
    this.rotationAngle = CubeRotationAngle[CubeRotationAngleType.Angle90]
    this.rotationSpeed = GameplayConfig.cube.rotationSpeed[this.rotationType][CubeRotationAngleType.Angle90];
    this.object.rotation.set(0, 0, 0);
    this.object.updateMatrixWorld();

    this.initCubeSide = null;
    this.initCubeRotationDirection = null;
  }

  public rotateToDirection(rotateDirection: RotateDirection, rotationAngleType: CubeRotationAngleType = CubeRotationAngleType.Angle90): void {
    if (this.isRotating) {
      return;
    }

    this.isRotating = true;
    this.rotationDirection = rotateDirection;

    this.rotationAngle = CubeRotationAngle[rotationAngleType];
    this.rotationSpeed = GameplayConfig.cube.rotationSpeed[this.rotationType][rotationAngleType];
  }

  public getSideAfterRotation(rotateDirection: RotateDirection): CubeSide {
    const blankObject = new THREE.Object3D();
    blankObject.rotation.copy(this.object.rotation);

    const rotationConfig: IRotationAxisConfig = RotationAxisConfig[rotateDirection];
    blankObject.rotateOnWorldAxis(rotationConfig.axis, rotationConfig.sign * this.rotationAngle);
    blankObject.updateMatrixWorld();

    return this.calculateCubeSide(blankObject);
  }

  public instantRotateToDirection(rotateDirection: RotateDirection): void {
    this.rotationDirection = rotateDirection;

    this.applyRotationByDirection(this.rotationAngle);
    this.object.updateMatrixWorld();

    this.onEndRotating();
  }

  public turn(turnDirection: TurnDirection): void {
    if (this.isRotating) {
      return;
    }

    this.isRotating = true;
    this.turnDirection = turnDirection;

    const angleType: CubeRotationAngleType = CubeRotationAngleType.Angle90;
    this.rotationSpeed = GameplayConfig.cube.rotationSpeed[this.rotationType][angleType];
    this.rotationAngle = CubeRotationAngle[angleType];
  }

  public rotateToStartSide(): void {
    this.rotationType = CubeRotationType.ForRespawn;

    if (this.currentSide !== this.initCubeSide) {
      this.waitingForRotationOnRespawn = true;
      this.rotateFromSideToSide(this.currentSide, this.initCubeSide);
    } else {
      this.turnToStartRotation();
    }
  }

  public turnToStartRotation(): void {
    if (this.currentRotationDirection !== this.initCubeRotationDirection) {
      this.waitingForTurnOnRespawn = true;
      this.respawnTurnDirections = [...TurnDirectionForRotationConfig[this.currentRotationDirection][this.initCubeRotationDirection]];

      const turnDirection: TurnDirection = this.respawnTurnDirections.pop();
      this.turn(turnDirection);
    } else {
      this.onEndRotatingOnRespawn();
    }
  }

  public instantTurn(turnDirection: TurnDirection): void {
    this.turnDirection = turnDirection;

    this.applyTurnByDirection(this.rotationAngle);
    this.object.updateMatrixWorld();

    this.onEndRotating();
  }

  public getCurrentSide(): CubeSide {
    return this.currentSide;
  }

  public getCurrentRotationDirection(): CubeRotationDirection {
    return this.currentRotationDirection;
  }

  public setInitRotation(side: CubeSide, rotationDirection: CubeRotationDirection): void {
    this.initCubeSide = side;
    this.initCubeRotationDirection = rotationDirection;

    const rotationDirections = RotationBySideConfig[side];
    const turnDirections = TurnBySideConfig[rotationDirection];

    for (let i = 0; i < rotationDirections.length; i++) {
      this.instantRotateToDirection(rotationDirections[i]);
    }

    for (let i = 0; i < turnDirections.length; i++) {
      this.instantTurn(turnDirections[i]);
    }
  }

  private rotateFromSideToSide(fromSide: CubeSide, toSide: CubeSide): void {
    const isFinalSideNeighboring: boolean = NeighboringSidesConfig[fromSide].includes(toSide);

    if (isFinalSideNeighboring) {
      const rotationDirection: RotateDirection = RotationDirectionsFromSideToSideConfig[fromSide][toSide][this.currentRotationDirection];
      this.rotateToDirection(rotationDirection);
    } else {
      this.rotateToDirection(RotateDirection.Right, CubeRotationAngleType.Angle180);
    }
  }

  private checkRotationOnRespawn(): void {
    if (this.waitingForRotationOnRespawn) {
      this.waitingForRotationOnRespawn = false;
      this.turnToStartRotation();

      return;
    }

    if (this.waitingForTurnOnRespawn) {
      if (this.respawnTurnDirections.length > 0) {
        const turnDirection: TurnDirection = this.respawnTurnDirections.pop();
        this.turn(turnDirection);
      } else {
        this.onEndRotatingOnRespawn();
      }
    }
  }

  private onEndRotatingOnRespawn(): void {
    this.waitingForRotationOnRespawn = false;
    this.waitingForTurnOnRespawn = false;
    this.respawnTurnDirections = [];
    this.emitter.emit('endRotatingOnRespawn');
  }


  private onEndRotating(): void {
    this.resetProgress();
    this.snapRotation();
    this.currentSide = this.calculateCubeSide(this.object);
    this.calculateCurrentRotationDirection();
  }

  private resetProgress(): void {
    this.isRotating = false;
    this.rotationProgress = 0;
    this.lastEasedAngle = 0;
    this.rotationDirection = null;
    this.turnDirection = null;
  }

  private resetRotationType(): void {
    this.rotationType = CubeRotationType.Regular;
    this.rotationAngle = CubeRotationAngle[CubeRotationAngleType.Angle90]
    this.rotationSpeed = GameplayConfig.cube.rotationSpeed[this.rotationType][CubeRotationAngleType.Angle90];
  }

  private snapRotation(): void {
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(this.object.rotation);

    const euler = new THREE.Euler();
    euler.setFromQuaternion(quaternion);

    this.object.rotation.set(euler.x, euler.y, euler.z);
    this.object.updateMatrixWorld();
  }

  private applyRotationByDirection(deltaAngle: number): void {
    const rotationConfig: IRotationAxisConfig = RotationAxisConfig[this.rotationDirection];
    this.object.rotateOnWorldAxis(rotationConfig.axis, rotationConfig.sign * deltaAngle);
  }

  private applyTurnByDirection(deltaAngle: number): void {
    const turnAxis = new THREE.Vector3(0, 0, 1);

    switch (this.turnDirection) {
      case TurnDirection.Clockwise:
        this.object.rotateOnWorldAxis(turnAxis, -deltaAngle);
        break;
      case TurnDirection.CounterClockwise:
        this.object.rotateOnWorldAxis(turnAxis, deltaAngle);
        break;
    }
  }

  private calculateCubeSide(object: THREE.Object3D): CubeSide {
    const matrixWorld: THREE.Matrix4 = object.matrixWorld;

    let activeSide: CubeSide = null;
    let smallestAngle: number = Infinity;

    const forwardDirection = new THREE.Vector3(0, 0, 1);

    for (const side in SideVectorConfig) {
      const sideVector: THREE.Vector3 = SideVectorConfig[side].clone().applyMatrix4(matrixWorld).normalize();
      const angle: number = sideVector.angleTo(forwardDirection);

      if (angle < smallestAngle) {
        smallestAngle = angle;
        activeSide = side as CubeSide;
      }
    }

    return activeSide;
  }

  private calculateCurrentRotationDirection(): void {
    const worldQuaternion = this.object.quaternion;

    const worldTop: THREE.Vector3 = LocalEdgeDirections[this.currentSide][CubeRotationDirection.Top].clone().applyQuaternion(worldQuaternion);
    const worldRight: THREE.Vector3 = LocalEdgeDirections[this.currentSide][CubeRotationDirection.Right].clone().applyQuaternion(worldQuaternion);
    const worldBottom: THREE.Vector3 = LocalEdgeDirections[this.currentSide][CubeRotationDirection.Bottom].clone().applyQuaternion(worldQuaternion);
    const worldLeft: THREE.Vector3 = LocalEdgeDirections[this.currentSide][CubeRotationDirection.Left].clone().applyQuaternion(worldQuaternion);

    const worldUp = new THREE.Vector3(0, 1, 0);

    const topDot: number = worldTop.dot(worldUp);
    const rightDot: number = worldRight.dot(worldUp);
    const bottomDot: number = worldBottom.dot(worldUp);
    const leftDot: number = worldLeft.dot(worldUp);

    if (topDot > rightDot && topDot > bottomDot && topDot > leftDot) {
      this.currentRotationDirection = CubeRotationDirection.Top;
    } else if (rightDot > topDot && rightDot > bottomDot && rightDot > leftDot) {
      this.currentRotationDirection = CubeRotationDirection.Right;
    } else if (bottomDot > topDot && bottomDot > rightDot && bottomDot > leftDot) {
      this.currentRotationDirection = CubeRotationDirection.Bottom;
    } else if (leftDot > topDot && leftDot > rightDot && leftDot > bottomDot) {
      this.currentRotationDirection = CubeRotationDirection.Left;
    }
  }
}
