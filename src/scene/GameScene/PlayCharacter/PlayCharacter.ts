import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { CubeSide } from '../../Enums/CubeSide';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CharacterSurfaceConfig } from '../../Configs/SurfaceConfig';

export default class PlayCharacter extends THREE.Group {
  private view: THREE.Mesh;
  private levelConfig: ILevelConfig;
  private activeSurface: CubeSide;
  private surfacePosition: THREE.Vector2 = new THREE.Vector2();


  private isActive: boolean = false;

  constructor() {
    super();

    this.initView();
  }

  public update(dt: number) {
    // if (this.isMoving) {
    //   console.log('isMoving');
    //   const distance: number = dt * 5;
    //   const direction: THREE.Vector2 = this.targetPosition.clone().sub(this.currentPosition).normalize().multiplyScalar(distance);

    //   const newPosition: THREE.Vector2 = this.currentPosition.clone().add(direction);
    //   this.setPosition(this.levelConfig.playCharacter.side, newPosition.x, newPosition.y);

    //   if (this.currentPosition.equals(this.targetPosition)) {
    //     this.isMoving = false;
    //   }
    // }
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    const position: THREE.Vector2 = levelConfig.playCharacter.position;
    this.setActiveSurface(levelConfig.playCharacter.side);
    this.setPosition(position.x, position.y);
  }

  public setActiveSurface(surface: CubeSide): void {
    this.activeSurface = surface;
  }

  public setPosition(x: number, y: number): void {
    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.cellSize;
    const startOffset: number = (this.levelConfig.size - 1) * 0.5 * GameplayConfig.cellSize;

    const surfaceConfig = CharacterSurfaceConfig[this.activeSurface](x, y);    
    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x * GameplayConfig.cellSize - startOffset) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y * GameplayConfig.cellSize - startOffset) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z * GameplayConfig.cellSize - startOffset) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);

    this.surfacePosition.set(x, y);
  }

  public move(x: number, y: number): void {
    this.setPosition(x, y);
  }

  public isActivated(): boolean {
    return this.isActive;
  }

  public getSurfacePosition(): THREE.Vector2 {
    return this.surfacePosition;
  }

  private initView(): void {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const view = this.view = new THREE.Mesh(geometry, material);
    this.add(view);

    view.scale.set(GameplayConfig.cellScale, GameplayConfig.cellScale, GameplayConfig.cellScale);
  }
}
