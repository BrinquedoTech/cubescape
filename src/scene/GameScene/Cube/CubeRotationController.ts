import * as THREE from 'three';
import { RotateDirection, TurnDirection } from "../../Enums/RotateDirection";
import TWEEN from 'three/addons/libs/tween.module.js';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CubeSide } from '../../Enums/CubeSide';
import { LocalEdgeDirections, SideVectorConfig } from '../../Configs/SurfaceConfig';
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';
import mitt, { Emitter } from 'mitt';
import { RotationBySideConfig, TurnBySideConfig } from '../../Configs/StartSideConfig';

type Events = {
  endRotating: string;
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

  public emitter: Emitter<Events> = mitt<Events>();

  constructor(object: THREE.Object3D) {
    this.object = object;

    this.rotationDirection = null;
    this.turnDirection = null;
    this.isRotating = false;
    this.rotationProgress = 0;
    this.rotationSpeed = GameplayConfig.cubeRotationSpeed;
    this.lastEasedAngle = 0;
    this.rotationAngle = Math.PI * 0.5;
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
      }
    }
  }

  public rotateToDirection(rotateDirection: RotateDirection): void {
    if (this.isRotating) {
      return;
    }

    this.isRotating = true;
    this.rotationDirection = rotateDirection;
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
    const rotationDirections = RotationBySideConfig[side];
    const turnDirections = TurnBySideConfig[rotationDirection];

    for (let i = 0; i < rotationDirections.length; i++) {
      this.instantRotateToDirection(rotationDirections[i]);
    }

    for (let i = 0; i < turnDirections.length; i++) {
      this.instantTurn(turnDirections[i]);
    }
  }

  private onEndRotating(): void {
    this.resetProgress();
    this.snapRotation();
    this.calculateCurrentSide();
    this.calculateCurrentRotationDirection();
  }

  private resetProgress(): void {
    this.isRotating = false;
    this.rotationProgress = 0;
    this.lastEasedAngle = 0;
    this.rotationDirection = null;
    this.turnDirection = null;
  }

  private snapRotation(): void {
    this.object.rotation.x = Math.round(this.object.rotation.x / (this.rotationAngle)) * this.rotationAngle;
    this.object.rotation.y = Math.round(this.object.rotation.y / (this.rotationAngle)) * this.rotationAngle;
    this.object.rotation.z = Math.round(this.object.rotation.z / (this.rotationAngle)) * this.rotationAngle;
  }

  private applyRotationByDirection(deltaAngle: number): void {
    switch (this.rotationDirection) {
      case RotateDirection.Right:
        this.object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -deltaAngle);
        break;
      case RotateDirection.Left:
        this.object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaAngle);
        break;
      case RotateDirection.Up:
        this.object.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), deltaAngle);
        break;
      case RotateDirection.Down:
        this.object.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -deltaAngle);
        break;
    }
  }

  private applyTurnByDirection(deltaAngle: number): void {
    switch (this.turnDirection) {
      case TurnDirection.Clockwise:
        this.object.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), -deltaAngle);
        break;
      case TurnDirection.CounterClockwise:
        this.object.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), deltaAngle);
        break;
    }
  }

  private calculateCurrentSide(): void {
    const matrixWorld: THREE.Matrix4 = this.object.matrixWorld;

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

    this.currentSide = activeSide;
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
