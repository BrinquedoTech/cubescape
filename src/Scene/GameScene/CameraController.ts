import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import PlayerCharacter from './PlayerCharacter/PlayerCharacter';
import Cube from './Cube/Cube';
import { CubeState } from '../../Data/Enums/Cube/CubeState';
import CameraConfig from '../../Data/Configs/Scene/CameraConfig';
import { CubeSide } from '../../Data/Enums/Cube/CubeSide';
import { AxisByRotationDirection, CubeSideAxisConfig } from '../../Data/Configs/Cube/SideConfig';
import { CubeRotationDirection } from '../../Data/Enums/Cube/CubeRotationDirection';
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';
import { ILevelConfig } from '../../Data/Interfaces/ILevelConfig';
import { DeviceState } from '../../Data/Enums/DeviceState';
import ThreeJSHelper from '../../Helpers/ThreeJSHelper';

export class CameraController extends THREE.Group {
  private camera: THREE.PerspectiveCamera;
  private playerCharacter: PlayerCharacter;
  private cube: Cube;
  private playerCharacterWorldPosition: THREE.Vector3 = new THREE.Vector3();
  private levelConfig: ILevelConfig;
  private currentMaxSideSize: number = 0;

  private lookAtPosition: THREE.Vector3 = new THREE.Vector3();
  private lookDirection: THREE.Vector3 = new THREE.Vector3();

  private isMobile: boolean;

  constructor(camera: THREE.PerspectiveCamera) {
    super();

    this.camera = camera;

    this.isMobile = PIXI.isMobile.any;

    this.init();
  }

  public update(dt: number): void {
    if (DebugConfig.orbitControls) {
      return;
    }

    this.followPlayerCharacter(dt);
    this.lookAtPlayerCharacter(dt);
    this.rotateByPlayerPosition(dt);
    this.updateDistanceFromCube(dt);
  }

  public setPlayerCharacter(playerCharacter: PlayerCharacter): void {
    this.playerCharacter = playerCharacter;

    this.lookAtPosition = this.playerCharacter.getWorldPosition(new THREE.Vector3());
  }

  public setCube(cube: Cube): void {
    this.cube = cube;
  }

  public setLevelConfig(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;
  }

  public onCubeSideChange(side: CubeSide): void {
    const map: string[][] = this.levelConfig.map.sides[side];
    this.currentMaxSideSize = Math.max(map.length, map[0].length);
  }

  public forceUpdateDistanceFromCube(): void {
    if (CameraConfig.distanceFromCube.dynamic.enable) {
      const deviceState: DeviceState = this.isMobile ? DeviceState.Mobile : DeviceState.Desktop;
      const distanceConfig = CameraConfig.distanceFromCube.dynamic[deviceState];
      this.camera.position.z = distanceConfig.start + this.currentMaxSideSize * distanceConfig.sideCoefficient;
    }
  }

  private followPlayerCharacter(dt: number): void {
    if (CameraConfig.followPlayer.enabled && this.playerCharacter.isActivated()) {
      let lerpFactor = CameraConfig.followPlayer.lerpFactor * 60;

      if (this.cube.getState() === CubeState.Rotating) {
        lerpFactor = CameraConfig.followPlayer.lerpFactorCubeRotating * 60;
      }

      this.playerCharacter.getWorldPosition(this.playerCharacterWorldPosition);

      this.camera.position.x = ThreeJSHelper.lerp(this.camera.position.x, this.playerCharacterWorldPosition.x, lerpFactor * dt);
      this.camera.position.y = ThreeJSHelper.lerp(this.camera.position.y, this.playerCharacterWorldPosition.y, lerpFactor * dt);

      this.camera.lookAt(this.camera.position.x, this.camera.position.y, 0);
    }
  }

  private lookAtPlayerCharacter(dt: number): void {
    if (CameraConfig.lookAtPlayer.enabled && this.playerCharacter.isActivated()) {
      const targetPosition = this.playerCharacter.getWorldPosition(new THREE.Vector3());
      this.lookDirection.subVectors(targetPosition, this.camera.position).normalize();

      let lerpFactor = CameraConfig.lookAtPlayer.lerpFactor * 60;

      if (this.cube.getState() === CubeState.Rotating) {
        lerpFactor = CameraConfig.lookAtPlayer.lerpFactorCubeRotating * 60;
      }

      this.lookAtPosition.lerp(targetPosition, lerpFactor * dt);

      this.camera.lookAt(this.lookAtPosition);
    }
  }

  private rotateByPlayerPosition(dt: number): void {
    if (CameraConfig.rotationByPlayerPosition.enabled) {
      const cubeSide: CubeSide = this.cube.getCurrentSide();
      const cubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const cubeRotationDirection: CubeRotationDirection = this.cube.getCurrentRotationDirection();

      const positionX: number = this.playerCharacter.position[cubeSideAxisConfig.xAxis] * cubeSideAxisConfig.xFactor;
      const positionY: number = this.playerCharacter.position[cubeSideAxisConfig.yAxis] * cubeSideAxisConfig.yFactor;

      const { x, y } = AxisByRotationDirection[cubeRotationDirection](positionX, positionY);
      let lerpFactor = CameraConfig.rotationByPlayerPosition.lerpFactor * 60 * dt;

      this.camera.position.x = ThreeJSHelper.lerp(this.camera.position.x, x * CameraConfig.rotationByPlayerPosition.distanceCoefficient, lerpFactor);
      this.camera.position.y = ThreeJSHelper.lerp(this.camera.position.y, -y * CameraConfig.rotationByPlayerPosition.distanceCoefficient, lerpFactor);

      this.camera.lookAt(0, 0, 0);
    }
  }

  private updateDistanceFromCube(dt: number): void {
    if (CameraConfig.distanceFromCube.dynamic.enable) {
      const deviceState: DeviceState = this.isMobile ? DeviceState.Mobile : DeviceState.Desktop;
      const distanceConfig = CameraConfig.distanceFromCube.dynamic[deviceState];
      const targetPositionZ = distanceConfig.start + this.currentMaxSideSize * distanceConfig.sideCoefficient;
      this.camera.position.z = ThreeJSHelper.lerp(this.camera.position.z, targetPositionZ, CameraConfig.distanceFromCube.dynamic.lerpFactor * 60 * dt);
    }
  }

  private init(): void {
    if (CameraConfig.distanceFromCube.static) {
      this.camera.position.z = CameraConfig.distanceFromCube.static;
    } else {
      const deviceState: DeviceState = this.isMobile ? DeviceState.Mobile : DeviceState.Desktop;
      this.camera.position.z = CameraConfig.distanceFromCube.dynamic[deviceState].start;
    }
  }
}
