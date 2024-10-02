import * as THREE from 'three';
import { RotateDirection, TurnDirection } from "../../Enums/RotateDirection";
import TWEEN from 'three/addons/libs/tween.module.js';
import GameplayConfig from '../../Configs/GameplayConfig';

export default class CubeRotateController {
  private object: THREE.Object3D;
  private rotationDirection: RotateDirection;
  private turnDirection: TurnDirection;
  private rotationProgress: number;
  private rotationSpeed: number;
  private isRotating: boolean;
  private lastEasedAngle: number;
  private rotationAngle: number;

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
        this.resetProgress();
        this.snapRotation();
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

  public turn(turnDirection: TurnDirection): void {
    if (this.isRotating) {
      return;
    }

    this.isRotating = true;
    this.turnDirection = turnDirection;
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
}
