import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { CubeSide } from '../../Enums/CubeSide';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CharacterSurfaceConfig } from '../../Configs/SurfaceConfig';
import { MoveDirection } from '../../Enums/MoveDirection';
import { PlayCharacterState } from '../../Enums/PlayCharacterState';

export default class PlayCharacter extends THREE.Group {
  private view: THREE.Mesh;
  private levelConfig: ILevelConfig;
  private activeSurface: CubeSide;
  private previousGridPosition: THREE.Vector2 = new THREE.Vector2();
  private currentGridPosition: THREE.Vector2 = new THREE.Vector2();
  private movingDirection: MoveDirection;
  private surfacePosition: THREE.Vector2 = new THREE.Vector2();
  private state: PlayCharacterState = PlayCharacterState.Idle;
  private isCrossedCellCenter: boolean = false;


  private isActive: boolean = false;

  constructor() {
    super();

    this.initView();
  }

  public update(dt: number) {

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

  public setPosition(cubeSide: CubeSide, x: number, y: number): void {
    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.gridSize;
    const startOffset: number = (this.levelConfig.size - 1) * 0.5 * GameplayConfig.gridSize;

    const surfaceConfig = CharacterSurfaceConfig[cubeSide](x, y);    
    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x - startOffset) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y - startOffset) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z - startOffset) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);
    this.surfacePosition.set(x, y);

    this.calculateGridPosition();
  }

  public setGridPosition(cubeSide: CubeSide, gridX: number, gridY: number): void {
    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.gridSize;
    const startOffset: number = (this.levelConfig.size - 1) * 0.5 * GameplayConfig.gridSize;

    const surfaceConfig = CharacterSurfaceConfig[cubeSide](gridX, gridY);    
    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x * GameplayConfig.gridSize - startOffset) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y * GameplayConfig.gridSize - startOffset) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z * GameplayConfig.gridSize - startOffset) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);
    this.previousGridPosition.set(this.currentGridPosition.x, this.currentGridPosition.y);
    this.currentGridPosition.set(gridX, gridY);
  }

  public moveToDirection(direction: MoveDirection): void {
    this.state = PlayCharacterState.Moving;
    this.movingDirection = direction; 
  }

  public stopMoving(): void {
    this.state = PlayCharacterState.Idle;
    this.movingDirection = null;
  }

  public getSurfacePosition(): THREE.Vector2 {
    return this.surfacePosition;
  }

  public getMovingDirection(): MoveDirection {
    return this.movingDirection;
  }

  public isActivated(): boolean {
    return this.isActive;
  }

  public getState(): PlayCharacterState {
    return this.state;
  }

  public setIsCrossedCellCenter(value: boolean): void {
    this.isCrossedCellCenter = value;
  }

  public getIsCrossedCellCenter(): boolean {
    return this.isCrossedCellCenter;
  }

  public getGridPosition(): THREE.Vector2 {
    return this.currentGridPosition;
  }

  public isCrossedCenterGridCell(x: number, y: number): boolean {
    const cellCenterX = Math.round(x / GameplayConfig.gridSize) * GameplayConfig.gridSize;
    const cellCenterY = Math.round(y / GameplayConfig.gridSize) * GameplayConfig.gridSize;

    return Math.abs(x - cellCenterX) < GameplayConfig.gridSize * 0.1 && Math.abs(y - cellCenterY) < GameplayConfig.gridSize * 0.1;
  }

  private calculateGridPosition(): void {
    const gridX: number = Math.round(this.surfacePosition.x / GameplayConfig.gridSize);
    const gridY: number = Math.round(this.surfacePosition.y / GameplayConfig.gridSize);

    if (gridX !== this.currentGridPosition.x || gridY !== this.currentGridPosition.y) {
      // console.log(`%c new cell `, 'background: #222; color: #dd0000', gridX, gridY);
      this.previousGridPosition.set(this.currentGridPosition.x, this.currentGridPosition.y);
      this.currentGridPosition.set(gridX, gridY);
      this.isCrossedCellCenter = false;
    }
    // console.log(gridX, gridY);
    // this.setGridPosition(this.activeSurface, gridX, gridY);
  }

  private initView(): void {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const view = this.view = new THREE.Mesh(geometry, material);
    this.add(view);

    view.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
  }
}
