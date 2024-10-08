import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { CubeSide } from '../../Enums/CubeSide';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CharacterSurfaceConfig } from '../../Configs/SurfaceConfig';
import { PlayerCharacterState } from '../../Enums/PlayerCharacterState';
import TWEEN from 'three/addons/libs/tween.module.js';
import GridHelper from '../../Helpers/GridHelper';
import { PlayerCharacterConfig } from '../../Configs/PlayerCharacterConfig';

export default class PlayerCharacter extends THREE.Group {
  // private view: THREE.Mesh;
  private levelConfig: ILevelConfig;
  private activeSurface: CubeSide;
  private gridPosition: THREE.Vector2 = new THREE.Vector2();
  private surfacePosition: THREE.Vector2 = new THREE.Vector2();
  private state: PlayerCharacterState = PlayerCharacterState.Idle;
  
  private startMovingPosition: THREE.Vector2 = new THREE.Vector2();
  private targetMovingPosition: THREE.Vector2 = new THREE.Vector2();
  private movingElapsedTime: number = 0;
  private movingDuration: number = 0;

  private isActive: boolean = false;

  constructor() {
    super();

    this.initView();
  }

  public update(dt: number) {
    if (this.state === PlayerCharacterState.Moving) {
      this.movingElapsedTime += dt;

      const t: number = Math.min(this.movingElapsedTime / this.movingDuration, 1);
      const easeT: number = TWEEN.Easing.Quintic.Out(t);

      const targetX: number = this.startMovingPosition.x + (this.targetMovingPosition.x - this.startMovingPosition.x) * easeT;
      const targetY: number = this.startMovingPosition.y + (this.targetMovingPosition.y - this.startMovingPosition.y) * easeT;

      this.setPositionOnActiveSurface(targetX, targetY);

      if (t >= 1) {
        this.stopMoving();
        this.state = PlayerCharacterState.Idle;
        this.movingElapsedTime = 0;
        this.setGridPositionOnActiveSurface(this.targetMovingPosition.x, this.targetMovingPosition.y);
      }
    }
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    const gridPosition: THREE.Vector2 = levelConfig.playerCharacter.gridPosition;
    this.setActiveSurface(levelConfig.playerCharacter.side);
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
    this.state = PlayerCharacterState.Moving;
    this.targetMovingPosition.set(gridX * GameplayConfig.gridSize, gridY * GameplayConfig.gridSize);
    this.startMovingPosition.set(this.surfacePosition.x, this.surfacePosition.y);

    const distance: number = GridHelper.calculateGridLineDistance(this.gridPosition.x, this.gridPosition.y, gridX, gridY);
    this.movingDuration = distance * PlayerCharacterConfig.speedCoefficient;
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

    const gridPosition: THREE.Vector2 = GridHelper.calculateGridPositionByCoordinates(x, y);
    this.gridPosition.set(gridPosition.x, gridPosition.y);
  }

  public setGridPosition(cubeSide: CubeSide, gridX: number, gridY: number): void {
    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.gridSize;
    const startOffset: number = (this.levelConfig.size - 1) * 0.5 * GameplayConfig.gridSize;

    const surfaceConfig = CharacterSurfaceConfig[cubeSide](gridX, gridY);    
    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x * GameplayConfig.gridSize - startOffset) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y * GameplayConfig.gridSize - startOffset) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z * GameplayConfig.gridSize - startOffset) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);
    this.gridPosition.set(gridX, gridY);
  }

  public stopMoving(): void {
    this.state = PlayerCharacterState.Idle;
  }

  public isActivated(): boolean {
    return this.isActive;
  }

  public getState(): PlayerCharacterState {
    return this.state;
  }

  public getGridPosition(): THREE.Vector2 {
    return this.gridPosition;
  }

  private initView(): void {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const view = new THREE.Mesh(geometry, material);
    this.add(view);

    view.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
  }
}
