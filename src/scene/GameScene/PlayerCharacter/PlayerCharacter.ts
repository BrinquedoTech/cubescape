import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { CubeSide } from '../../Enums/CubeSide';
import GameplayConfig from '../../Configs/Main/GameplayConfig';
import { CubeSideAxisConfig } from '../../Configs/SideConfig';
import { PlayerCharacterState } from '../../Enums/PlayerCharacterState';
import TWEEN from 'three/addons/libs/tween.module.js';
import CubeHelper from '../../Helpers/CubeHelper';
import { ICubePosition, ICubeSideAxisConfig } from '../../Interfaces/ICubeConfig';
import mitt, { Emitter } from 'mitt';
import { CellType } from '../../Enums/CellType';

type Events = {
  onMovingEnd: string;
};

export default class PlayerCharacter extends THREE.Group {
  // private view: THREE.Mesh;
  private levelConfig: ILevelConfig;
  private activeSide: CubeSide;
  private gridPosition: THREE.Vector2 = new THREE.Vector2();
  private sidePosition: THREE.Vector2 = new THREE.Vector2();
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
    this.hide();
  }

  public update(dt: number) {
    if (this.state === PlayerCharacterState.Moving) {
      this.movingElapsedTime += dt;

      const t: number = Math.min(this.movingElapsedTime / this.movingDuration, 1);
      const easeT: number = TWEEN.Easing.Sinusoidal.Out(t);

      const targetX: number = this.startMovingPosition.x + (this.targetMovingPosition.x - this.startMovingPosition.x) * easeT;
      const targetY: number = this.startMovingPosition.y + (this.targetMovingPosition.y - this.startMovingPosition.y) * easeT;

      this.setPositionOnActiveSide(targetX, targetY);

      if (t >= 1) {
        this.stopMoving();
      }
    }
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.setStartPosition();
    this.show();
  }

  public setActiveSide(side: CubeSide): void {
    this.activeSide = side;
  }

  public setPositionOnActiveSide(x: number, y: number): void {
    this.setPosition(this.activeSide, x, y);
  }

  public setGridPositionOnActiveSide(gridX: number, gridY: number): void {
    this.setGridPosition(this.activeSide, gridX, gridY);
  }

  public moveToGridCell(gridX: number, gridY: number): void {
    this.state = PlayerCharacterState.Moving;
    this.targetMovingPosition.set(gridX * GameplayConfig.grid.size, gridY * GameplayConfig.grid.size);
    this.startMovingPosition.set(this.sidePosition.x, this.sidePosition.y);
    this.targetMovingGridPosition.set(gridX, gridY);

    const distance: number = CubeHelper.calculateGridLineDistance(this.gridPosition.x, this.gridPosition.y, gridX, gridY);
    this.movingDuration = distance * (1 / GameplayConfig.playerCharacter.speed);
  }

  public setPosition(cubeSide: CubeSide, x: number, y: number): void {
    const newPosition: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, cubeSide, x, y, false);

    this.position.set(newPosition.x, newPosition.y, newPosition.z);
    this.sidePosition.set(x, y);

    const gridPosition: THREE.Vector2 = CubeHelper.calculateGridPositionByCoordinates(x, y);
    this.gridPosition.set(gridPosition.x, gridPosition.y);
  }

  public setGridPosition(cubeSide: CubeSide, gridX: number, gridY: number): void {
    const newPosition: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, cubeSide, gridX, gridY);

    this.position.set(newPosition.x, newPosition.y, newPosition.z);
    this.gridPosition.set(gridX, gridY);
    this.sidePosition.set(gridX * GameplayConfig.grid.size, gridY * GameplayConfig.grid.size);
  }

  public updatePositionOnRealPosition(): void {
    const gridPosition: THREE.Vector2 = this.getGridPositionFromRealPosition();
    this.setGridPositionOnActiveSide(gridPosition.x, gridPosition.y);
  }

  public stopMoving(): void {
    this.state = PlayerCharacterState.Idle;
    this.movingElapsedTime = 0;
    this.startMovingPosition.set(0, 0);
    this.targetMovingPosition.set(0, 0);
    this.setGridPositionOnActiveSide(this.targetMovingGridPosition.x, this.targetMovingGridPosition.y);

    this.emitter.emit('onMovingEnd');
  }

  public reset(): void {
    this.isActive = false;
    this.state = PlayerCharacterState.Idle;
    this.movingElapsedTime = 0;
    this.gridPosition = new THREE.Vector2();
    this.sidePosition = new THREE.Vector2();
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
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
    const itemPositions: ICubePosition[] = CubeHelper.getItemPositions(this.levelConfig.map.sides, CellType.Start);

    if (itemPositions.length > 0) {
      this.isActive = true;
      const startPosition: ICubePosition = itemPositions[0];
      this.setActiveSide(startPosition.side);
      this.setGridPositionOnActiveSide(startPosition.gridPosition.x, startPosition.gridPosition.y);
    } else {
      this.isActive = false;
      console.warn('Start position not found');
    }
  }

  private getGridPositionFromRealPosition(): THREE.Vector2 {
    const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[this.activeSide];

    const sideX: number = this.position[cubeSideAxisConfig.xAxis];
    const sideY: number = this.position[cubeSideAxisConfig.yAxis];

    const startOffsetX: number = (this.levelConfig.size[cubeSideAxisConfig.xAxis] - 1) * 0.5;
    const startOffsetY: number = (this.levelConfig.size[cubeSideAxisConfig.yAxis] - 1) * 0.5;

    const gridX: number = sideX / GameplayConfig.grid.size * cubeSideAxisConfig.xFactor + startOffsetX;
    const gridY: number = sideY / GameplayConfig.grid.size * cubeSideAxisConfig.yFactor + startOffsetY;

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
