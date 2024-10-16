import * as THREE from 'three';
import GameplayConfig from '../Configs/Main/GameplayConfig';
import { ICubePosition, ICubePositionWithID, ICubeSideAxisConfig } from '../Interfaces/ICubeConfig';
import { CellDirectionConfig, CharacterSideConfig, CubeSideAxisConfig, ObjectsRotationBySideConfig, SideVectorConfig } from '../Configs/SideConfig';
import { CubeSide } from '../Enums/CubeSide';
import { ILevelMapConfig } from '../Interfaces/ILevelConfig';
import { CellType } from '../Enums/CellType';
import { Direction } from '../Enums/Direction';

export default class CubeHelper {
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
    const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
    const distance: number = (levelSize[cubeSideAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;

    const sideConfig = CharacterSideConfig[cubeSide](x, y);

    const startOffsetX: number = (levelSize[cubeSideAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const startOffsetY: number = (levelSize[cubeSideAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const startOffsetZ: number = sideConfig.x === null ? startOffsetX : startOffsetY;

    const gridCoeff: number = returnGrid ? GameplayConfig.grid.size : 1;

    const newX: number = sideConfig.x !== null ? (sideConfig.x * gridCoeff - startOffsetX) * sideConfig.xFactor : distance * sideConfig.xFactor;
    const newY: number = sideConfig.y !== null ? (sideConfig.y * gridCoeff - startOffsetY) * sideConfig.yFactor : distance * sideConfig.yFactor;
    const newZ: number = sideConfig.z !== null ? (sideConfig.z * gridCoeff - startOffsetZ) * sideConfig.zFactor : distance * sideConfig.zFactor;

    return new THREE.Vector3(newX, newY, newZ);
  }

  public static getItemPositions(map: ILevelMapConfig, cellType: CellType): ICubePosition[] {
    const itemPositions: ICubePosition[] = [];

    for (let side in map) {
      const currentSide: CubeSide = side as CubeSide;
      const sideMap: string[][] = map[currentSide];

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

  public static getItemWithIDPositions(map: ILevelMapConfig, cellType: CellType): ICubePositionWithID[] {
    const itemPositions: ICubePositionWithID[] = [];

    for (let side in map) {
      const currentSide: CubeSide = side as CubeSide;
      const sideMap: string[][] = map[currentSide];

      for (let gridY: number = 0; gridY < sideMap.length; gridY++) {
        for (let gridX: number = 0; gridX < sideMap[gridY].length; gridX++) {
          const cellValue = sideMap[gridY][gridX];
          if (cellValue.startsWith(cellType)) {
            const idString: string = cellValue.replace(cellType, '');
            const id: number = parseInt(idString, 10);
            if (!isNaN(id)) {
              itemPositions.push({
                side: currentSide,
                gridPosition: new THREE.Vector2(gridX, gridY),
                id: id,
              });
            }
          }
        }
      }
    }

    return itemPositions;
  }

  public static setSideRotation(object: THREE.Object3D, side: CubeSide): void {
    const rotation: THREE.Euler = ObjectsRotationBySideConfig[side];
    object.rotation.set(rotation.x, rotation.y, rotation.z);
  }

  public static setRotationByDirection(object: THREE.Object3D, side: CubeSide, direction: Direction): void {
    const vectorAround: THREE.Vector3 = SideVectorConfig[side];
    const rotationAngle: number = CellDirectionConfig[direction].rotation.z;
    object.rotateOnWorldAxis(vectorAround, rotationAngle);
  }

  public static setRotationByAngle(object: THREE.Object3D, side: CubeSide, angle: number): void {
    const vectorAround: THREE.Vector3 = SideVectorConfig[side];
    object.rotateOnWorldAxis(vectorAround, angle);
  }
}
