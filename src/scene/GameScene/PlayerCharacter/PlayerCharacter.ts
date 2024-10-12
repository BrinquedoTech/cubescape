import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { CubeSide } from '../../Enums/CubeSide';
import GameplayConfig from '../../Configs/Main/GameplayConfig';
import { CubeSurfaceAxisConfig } from '../../Configs/SurfaceConfig';
import { PlayerCharacterState } from '../../Enums/PlayerCharacterState';
import TWEEN from 'three/addons/libs/tween.module.js';
import GridHelper from '../../Helpers/GridHelper';
import { ICubePosition, ICubeSurfaceAxisConfig } from '../../Interfaces/ICubeConfig';
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
    const newPosition: THREE.Vector3 = GridHelper.getPositionByGridAndSide(this.levelConfig.size, cubeSide, x, y, false);

    this.position.set(newPosition.x, newPosition.y, newPosition.z);
    this.surfacePosition.set(x, y);

    const gridPosition: THREE.Vector2 = GridHelper.calculateGridPositionByCoordinates(x, y);
    this.gridPosition.set(gridPosition.x, gridPosition.y);
  }

  public setGridPosition(cubeSide: CubeSide, gridX: number, gridY: number): void {
    const newPosition: THREE.Vector3 = GridHelper.getPositionByGridAndSide(this.levelConfig.size, cubeSide, gridX, gridY);

    this.position.set(newPosition.x, newPosition.y, newPosition.z);
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
    const itemPositions: ICubePosition[] = GridHelper.getItemPositions(this.levelConfig.map.surfaces, CellType.Start);

    if (itemPositions.length > 0) {
      const startPosition: ICubePosition = itemPositions[0];
      this.setActiveSurface(startPosition.side);
      this.setGridPositionOnActiveSurface(startPosition.gridPosition.x, startPosition.gridPosition.y);
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
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const view = new THREE.Mesh(geometry, material);
    this.add(view);

    view.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);
  }
}
