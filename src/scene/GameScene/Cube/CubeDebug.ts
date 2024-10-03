import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CubeSide } from '../../Enums/CubeSide';
import { SurfaceVectorConfig } from '../../Configs/SurfaceConfig';

export default class CubeDebug extends THREE.Group {
  private levelConfig: ILevelConfig;
  private grids: THREE.GridHelper[] = [];

  constructor() {
    super();

  }

  public setLevelConfig(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.removeAll();
    this.init();
  }

  private removeAll(): void {
   
  }

  private init(): void {
    this.initGrid();
    this.initTexts();
  }

  private initGrid(): void {
    const gridRotationConfig = {
      [CubeSide.Front]: { x: Math.PI * 0.5, y: 0, z: 0 },
      [CubeSide.Back]: { x: Math.PI * 0.5, y: Math.PI, z: 0 },
      [CubeSide.Left]: { x: 0, y: 0, z: Math.PI * 0.5 },
      [CubeSide.Right]: { x: 0, y: 0, z: -Math.PI * 0.5 },
      [CubeSide.Top]: { x: 0, y: 0, z: 0 },
      [CubeSide.Bottom]: { x: Math.PI, y: 0, z: 0 },
    };

    const offset: number = 0.01;
    const size: number = this.levelConfig.size * GameplayConfig.cellSize;

    for (const side in CubeSide) {
      const rotation: THREE.Vector3 = gridRotationConfig[CubeSide[side]];
      const position: THREE.Vector3 = SurfaceVectorConfig[CubeSide[side]].clone().multiplyScalar(size * 0.5 + GameplayConfig.cellSize + offset);

      const grid = new THREE.GridHelper(size, this.levelConfig.size, 0x0000ff, 0x808080);
      this.add(grid);
      grid.rotation.set(rotation.x, rotation.y, rotation.z);
      grid.position.set(position.x, position.y, position.z);

      this.grids.push(grid);
    }
  }

  private initTexts(): void {
    this.initCubeSideName();
  }

  private initCubeSideName(): void {
    const text = new Text();
    text.text = 'Cube debug info';
    text.fontSize = 0.2;
    text.anchorX = 'center';
    text.anchorY = 'middle';
    text.color = 0xffffff;
    text.position.set(0, 0, 0);
    text.rotation.set(0, 0, 0);
    this.add(text);
  }
}