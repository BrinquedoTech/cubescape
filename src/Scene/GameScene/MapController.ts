import * as THREE from 'three';
import { CubeSide } from "../Enums/CubeSide";
import { ILevelConfig, IMapConfig } from "../Interfaces/ILevelConfig";
import MapHelper from '../Helpers/MapHelper';

export default class MapController {
  private map: IMapConfig = {};
  private levelConfig: ILevelConfig;

  constructor() {

  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;
    this.reset();

    for (const cubeSide in CubeSide) {
      const side: CubeSide = CubeSide[cubeSide] as CubeSide;
      this.map[side] = MapHelper.createFullSideMap(this.levelConfig, side);
    }
  }

  public getMap(): IMapConfig {
    return this.map;
  }

  public getSideMap(cubeSide: CubeSide): string[][] {
    return this.map[cubeSide];
  }

  public getCellSymbol(cubeSide: CubeSide, x: number, y: number): string {
    return this.map[cubeSide][y][x];
  }

  public getMapSize(cubeSide: CubeSide): THREE.Vector2 {
    return new THREE.Vector2(
      this.map[cubeSide][0].length,
      this.map[cubeSide].length
    );
  }

  private reset(): void {
    this.map = {};
  }
}
