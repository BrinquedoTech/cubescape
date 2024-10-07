import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { CubeSide } from '../../Enums/CubeSide';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CharacterSurfaceConfig } from '../../Configs/SurfaceConfig';
import { PlayCharacterState } from '../../Enums/PlayCharacterState';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class PlayCharacter extends THREE.Group {
  // private view: THREE.Mesh;
  private levelConfig: ILevelConfig;
  private activeSurface: CubeSide;
  private currentGridPosition: THREE.Vector2 = new THREE.Vector2();
  private surfacePosition: THREE.Vector2 = new THREE.Vector2();
  private state: PlayCharacterState = PlayCharacterState.Idle;
  
  private targetSurfacePosition: THREE.Vector2 = new THREE.Vector2();
  private startMovingPosition: THREE.Vector2 = new THREE.Vector2();
  private elapsedTime: number = 0;
  private duration: number = 0;

  private isActive: boolean = false;

  constructor() {
    super();

    this.initView();
  }

  public update(dt: number) {
    if (this.state === PlayCharacterState.Moving) {
      this.elapsedTime += dt;

      const t = Math.min(this.elapsedTime / this.duration, 1);

      const easeT = TWEEN.Easing.Quintic.Out(t);

      const targetX = this.startMovingPosition.x + (this.targetSurfacePosition.x - this.startMovingPosition.x) * easeT;
      const targetY = this.startMovingPosition.y + (this.targetSurfacePosition.y - this.startMovingPosition.y) * easeT;

      this.setPositionOnActiveSurface(targetX, targetY);

      if (t >= 1) {
        this.stopMoving();
        this.state = PlayCharacterState.Idle;
        this.setGridPositionOnActiveSurface(this.targetSurfacePosition.x, this.targetSurfacePosition.y);

        this.elapsedTime = 0;
      }
    }
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    const gridPosition: THREE.Vector2 = levelConfig.playCharacter.gridPosition;
    this.setActiveSurface(levelConfig.playCharacter.side);
    this.setGridPosition(this.activeSurface, gridPosition.x, gridPosition.y);
  }

  public setActiveSurface(surface: CubeSide): void {
    this.activeSurface = surface;
  }

  public setPositionOnActiveSurface(gridX: number, gridY: number): void {
    this.setPosition(this.activeSurface, gridX, gridY);
  }

  public setGridPositionOnActiveSurface(x: number, y: number): void {
    this.setGridPosition(this.activeSurface, x, y);
  }

  public moveToGridCell(gridX: number, gridY: number): void {
    this.state = PlayCharacterState.Moving;
    this.targetSurfacePosition.set(gridX * GameplayConfig.gridSize, gridY * GameplayConfig.gridSize);
    this.startMovingPosition.set(this.surfacePosition.x, this.surfacePosition.y);

    const distance = this.calculateGridLineDistance(this.currentGridPosition.x, this.currentGridPosition.y, gridX, gridY);
    this.duration = distance * 0.07;
  }

  private calculateGridLineDistance(x1: number, y1: number, x2: number, y2: number): number {
    if (x1 === x2) {
      return Math.abs(y1 - y2);
    }

    if (y1 === y2) {
      return Math.abs(x1 - x2);
    }

    return null;
  }

  public setPosition(cubeSide: CubeSide, x: number, y: number): void {
    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.gridSize;
    const startOffset: number = (this.levelConfig.size - 1) * 0.5 * GameplayConfig.gridSize;

    const surfaceConfig = CharacterSurfaceConfig[cubeSide](x, y);    
    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x - startOffset) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y - startOffset) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z - startOffset) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);
    this.surfacePosition.set(x, y);

    this.calculateGridPosition(this.surfacePosition.x, this.surfacePosition.y);
  }

  public setGridPosition(cubeSide: CubeSide, gridX: number, gridY: number): void {
    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.gridSize;
    const startOffset: number = (this.levelConfig.size - 1) * 0.5 * GameplayConfig.gridSize;

    const surfaceConfig = CharacterSurfaceConfig[cubeSide](gridX, gridY);    
    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x * GameplayConfig.gridSize - startOffset) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y * GameplayConfig.gridSize - startOffset) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z * GameplayConfig.gridSize - startOffset) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);
    this.currentGridPosition.set(gridX, gridY);
  }

  public stopMoving(): void {
    this.state = PlayCharacterState.Idle;
  }

  public isActivated(): boolean {
    return this.isActive;
  }

  public getState(): PlayCharacterState {
    return this.state;
  }

  public getGridPosition(): THREE.Vector2 {
    return this.currentGridPosition;
  }

  private calculateGridPosition(x: number, y: number): void {
    const gridX: number = Math.round(x / GameplayConfig.gridSize);
    const gridY: number = Math.round(y / GameplayConfig.gridSize);
    this.currentGridPosition.set(gridX, gridY);
  }

  private initView(): void {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const view = new THREE.Mesh(geometry, material);
    this.add(view);

    view.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
  }
}
