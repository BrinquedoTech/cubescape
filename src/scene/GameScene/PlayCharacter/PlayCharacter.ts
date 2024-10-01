import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { CubeSide } from '../../Enums/CubeSide';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CharacterSurfaceConfig } from '../../Configs/SurfaceConfig';

export default class PlayCharacter extends THREE.Group {
  private view: THREE.Mesh;
  private levelConfig: ILevelConfig;

  private isActive: boolean = false;

  constructor() {
    super();

    this.initView();
  }

  public update(dt: number) {
    
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    const position: THREE.Vector2 = levelConfig.playCharacter.position;
    this.setPosition(levelConfig.playCharacter.surface, position.x, position.y);
  }

  public setPosition(surface: CubeSide, x: number, y: number): void {
    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.cellSize;
    const startOffset: number = (this.levelConfig.size - 1) * 0.5 * GameplayConfig.cellSize;

    const surfaceConfig = CharacterSurfaceConfig[surface](x, y);    
    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x * GameplayConfig.cellSize - startOffset) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y * GameplayConfig.cellSize - startOffset) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z * GameplayConfig.cellSize - startOffset) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    this.position.set(newX, newY, newZ);
  }

  public isActivated(): boolean {
    return this.isActive;
  }

  private initView(): void {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const view = this.view = new THREE.Mesh(geometry, material);
    this.add(view);

    view.scale.set(GameplayConfig.cellScale, GameplayConfig.cellScale, GameplayConfig.cellScale);
  }
}
