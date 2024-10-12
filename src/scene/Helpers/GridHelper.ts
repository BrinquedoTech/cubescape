import * as THREE from 'three';
import GameplayConfig from '../Configs/Main/GameplayConfig';
import { ICubePosition, ICubeSurfaceAxisConfig } from '../Interfaces/ICubeConfig';
import { CharacterSurfaceConfig, CubeSurfaceAxisConfig } from '../Configs/SurfaceConfig';
import { CubeSide } from '../Enums/CubeSide';
import { ILevelMapConfig } from '../Interfaces/ILevelConfig';
import { CellType } from '../Enums/CellType';

export default class GridHelper {
  constructor() {

  }

  public static isGridCellsEqual(cell1Position: THREE.Vector2, cell2Position: THREE.Vector2): boolean {
    return cell1Position.x === cell2Position.x && cell1Position.y === cell2Position.y;
  }

  public static calculateGridLineDistance(cell1X: number, cell1Y: number, cell2X: number, cell2Y: number): number {
    return Math.abs(cell1X - cell2X) + Math.abs(cell1Y - cell2Y);
  }

  public static calculateGridPositionByCoordinates(x: number, y: number): THREE.Vector2 {
    const gridX: number = Math.round(x / GameplayConfig.grid.size);
    const gridY: number = Math.round(y / GameplayConfig.grid.size);

    return new THREE.Vector2(gridX, gridY);
  }

  public static getPositionByGridAndSide(levelSize: THREE.Vector3, cubeSide: CubeSide, x: number, y: number, returnGrid: boolean = true): THREE.Vector3 {
    const cubeSurfaceAxisConfig: ICubeSurfaceAxisConfig = CubeSurfaceAxisConfig[cubeSide];
    const distance: number = (levelSize[cubeSurfaceAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;

    const surfaceConfig = CharacterSurfaceConfig[cubeSide](x, y);

    const startOffsetX: number = (levelSize[cubeSurfaceAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const startOffsetY: number = (levelSize[cubeSurfaceAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const startOffsetZ: number = surfaceConfig.x === null ? startOffsetX : startOffsetY;

    const gridCoeff: number = returnGrid ? GameplayConfig.grid.size : 1;

    const newX: number = surfaceConfig.x !== null ? (surfaceConfig.x * gridCoeff - startOffsetX) * surfaceConfig.xFactor : distance * surfaceConfig.xFactor;
    const newY: number = surfaceConfig.y !== null ? (surfaceConfig.y * gridCoeff - startOffsetY) * surfaceConfig.yFactor : distance * surfaceConfig.yFactor;
    const newZ: number = surfaceConfig.z !== null ? (surfaceConfig.z * gridCoeff - startOffsetZ) * surfaceConfig.zFactor : distance * surfaceConfig.zFactor;

    return new THREE.Vector3(newX, newY, newZ);
  }

  public static getItemPositions(map: ILevelMapConfig, cellType: CellType): ICubePosition[] {
    const itemPositions: ICubePosition[] = [];

    for (let side in map) {
      const currentSide: CubeSide = side as CubeSide;
      const sideMap: number[][] = map[currentSide];
      
      for (let gridY: number = 0; gridY < sideMap.length; gridY++) {
        for (let gridX: number = 0; gridX < sideMap[gridY].length; gridX++) {
          if (sideMap[gridY][gridX] === cellType) {
            itemPositions.push({
              side: currentSide,
              gridPosition: new THREE.Vector2(gridX, gridY),
            });
          }
        }
      }
    }

    return itemPositions;
  }
}
