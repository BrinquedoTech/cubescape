import * as THREE from 'three';
import { ILevelConfig, ILevelMapConfig } from '../../Interfaces/ILevelConfig';
import { CubeSide } from '../../Enums/CubeSide';
import GameplayConfig from '../../Configs/Main/GameplayConfig';
import { CharacterSurfaceConfig, CubeSurfaceAxisConfig } from '../../Configs/SurfaceConfig';
import { PlayerCharacterState } from '../../Enums/PlayerCharacterState';
import TWEEN from 'three/addons/libs/tween.module.js';
import GridHelper from '../../Helpers/GridHelper';
import { ICubeSurfaceAxisConfig } from '../../Interfaces/ICubeConfig';
import mitt, { Emitter } from 'mitt';
import { CellType } from '../../Enums/CellType';

type Events = {
  onMovingEnd: string;
};

export default class PlayerCharacter extends THREE.Group {
  // private view: THREE.Mesh;
  private levelConfig: ILevelConfig;
  private activeSurface: CubeSide;
  private gridPosition: THREE.Vector2 = new THREE.Vector2();
  private surfacePosition: THREE.Vector2 = new THREE.Vector2();
  private state: PlayerCharacterState = PlayerCharacterState.Idle;

  private startMovingPosition: THREE.Vector2 = new THREE.Vector2();
  private targetMovingPosition: THREE.Vector2 = new THREE.Vector2();
  private targetMovingGridPosition: THREE.Vector2 = new THREE.Vector2();
  private movingElapsedTime: number = 0;
  private movingDuration: number = 0;

  private isActive: boolean = false;

  public emitter: Emitter<Events> = mitt<Events>();

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
      }
    }
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.setStartPosition();
  }

  public setActiveSurface(surface: CubeSide): void {
    this.activeSurface = surface;
  }

  public setPositionOnActiveSurface(x: number, y: number): void {
    this.setPosition(this.activeSurface, x, y);
  }

  public setGridPositionOnActiveSurface(gridX: number, gridY: number): void {
    this.setGridPosition(this.activeSurface, gridX, gridY);
  }

  public moveToGridCell(gridX: number, gridY: number): void {
    this.state = PlayerCharacterState.Moving;
    this.targetMovingPosition.set(gridX * GameplayConfig.grid.size, gridY * GameplayConfig.grid.size);
    this.startMovingPosition.set(this.surfacePosition.x, this.surfacePosition.y);
    this.targetMovingGridPosition.set(gridX, gridY);

    const distance: number = GridHelper.calculateGridLineDistance(this.gridPosition.x, this.gridPosition.y, gridX, gridY);
    this.movingDuration = distance * (1 / GameplayConfig.playerCharacter.speed);
  }

  public setPosition(cubeSide: CubeSide, x: number, y: number): void {
    const cubeSurfaceAxisConfig: ICubeSurfaceAxisConfig = CubeSurfaceAxisConfig[cubeSide];
    const distance: number = (this.levelConfig.size[cubeSurfaceAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;

    const surfaceConfig = CharacterSurfaceConfig[cubeSide](x, y);

    const startOffsetX: number = (this.levelConfig.size[cubeSurfaceAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const startOffsetY: number = (this.levelConfig.size[cubeSurfaceAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const startOffsetZ: number = surfaceConfig.x === null ? startOffsetX : startOffsetY;

    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x - startOffsetX) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y - startOffsetY) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z - startOffsetZ) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);
    this.surfacePosition.set(x, y);

    const gridPosition: THREE.Vector2 = GridHelper.calculateGridPositionByCoordinates(x, y);
    this.gridPosition.set(gridPosition.x, gridPosition.y);
  }

  public setGridPosition(cubeSide: CubeSide, gridX: number, gridY: number): void {
    const cubeSurfaceAxisConfig: ICubeSurfaceAxisConfig = CubeSurfaceAxisConfig[cubeSide];
    const distance: number = (this.levelConfig.size[cubeSurfaceAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;

    const surfaceConfig = CharacterSurfaceConfig[cubeSide](gridX, gridY);

    const startOffsetX: number = (this.levelConfig.size[cubeSurfaceAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const startOffsetY: number = (this.levelConfig.size[cubeSurfaceAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const startOffsetZ: number = surfaceConfig.x === null ? startOffsetX : startOffsetY;

    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x * GameplayConfig.grid.size - startOffsetX) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y * GameplayConfig.grid.size - startOffsetY) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z * GameplayConfig.grid.size - startOffsetZ) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);
    this.gridPosition.set(gridX, gridY);
    this.surfacePosition.set(gridX * GameplayConfig.grid.size, gridY * GameplayConfig.grid.size);
  }

  public updatePositionOnRealPosition(): void {
    const gridPosition: THREE.Vector2 = this.getGridPositionFromRealPosition();
    this.setGridPositionOnActiveSurface(gridPosition.x, gridPosition.y);
  }

  public stopMoving(): void {
    this.state = PlayerCharacterState.Idle;
    this.movingElapsedTime = 0;
    this.setGridPositionOnActiveSurface(this.targetMovingGridPosition.x, this.targetMovingGridPosition.y);

    this.emitter.emit('onMovingEnd');
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

  private setStartPosition(): void {
    const allSidesMap: ILevelMapConfig = this.levelConfig.map.surfaces;

    for (let side in allSidesMap) {
      const currentSide: CubeSide = side as CubeSide;
      const sideMap: number[][] = allSidesMap[currentSide];
      
      for (let y: number = 0; y < sideMap.length; y++) {
        for (let x: number = 0; x < sideMap[y].length; x++) {
          if (sideMap[y][x] === CellType.Start) {
            this.setActiveSurface(currentSide);
            this.setGridPosition(this.activeSurface, x, y);
            break;
          }
        }
      }
    }
  }

  private getGridPositionFromRealPosition(): THREE.Vector2 {
    const cubeSurfaceAxisConfig: ICubeSurfaceAxisConfig = CubeSurfaceAxisConfig[this.activeSurface];

    const xSurface: number = this.position[cubeSurfaceAxisConfig.xAxis];
    const ySurface: number = this.position[cubeSurfaceAxisConfig.yAxis];

    const startOffsetX: number = (this.levelConfig.size[cubeSurfaceAxisConfig.xAxis] - 1) * 0.5;
    const startOffsetY: number = (this.levelConfig.size[cubeSurfaceAxisConfig.yAxis] - 1) * 0.5;

    const gridX: number = xSurface / GameplayConfig.grid.size * cubeSurfaceAxisConfig.xFactor + startOffsetX;
    const gridY: number = ySurface / GameplayConfig.grid.size * cubeSurfaceAxisConfig.yFactor + startOffsetY;

    return new THREE.Vector2(gridX, gridY);
  }

  private initView(): void {
    const geometry = new THREE.SphereGeometry(0.7, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const view = new THREE.Mesh(geometry, material);
    this.add(view);

    view.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);
  }
}
