import * as THREE from 'three';
import GameplayConfig from '../Configs/Main/GameplayConfig';
import { ICubePosition, ICubePositionWithID, ICubeSideAxisConfig } from '../Interfaces/ICubeConfig';
import { CellDirectionConfig, CharacterSideConfig, CubeSideAxisConfig, Direction2DVectorConfig, ObjectsRotationBySideConfig, SideVectorConfig } from '../Configs/SideConfig';
import { CubeSide } from '../Enums/CubeSide';
import { ILevelConfig, ILevelMapConfig } from '../Interfaces/ILevelConfig';
import { CellType } from '../Enums/CellType';
import { Direction } from '../Enums/Direction';
import { CellConfig } from '../Configs/CellsConfig';
import { ICellTypeWithID } from '../Interfaces/ICellConfig';
import { EnemyConfigMap, IWallSpikeConfig } from '../Interfaces/IEnemyConfig';

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
          if (CubeHelper.getCellTypeBySymbol(sideMap[gridY][gridX]) === cellType) {
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
          const cellSymbol: string = sideMap[gridY][gridX];
          const cellSymbolWithoutNumbers: string = cellSymbol.replace(/[0-9]/g, '');

          if (CubeHelper.getCellTypeBySymbol(cellSymbolWithoutNumbers) === cellType) {
            const id: number = parseInt(cellSymbol.replace(cellSymbolWithoutNumbers, ''), 10);

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

  public static getCellTypeBySymbol(symbol: string): CellType {
    const cellSymbolLetter: string = symbol.replace(/[0-9]/g, '');

    for (let cellType in CellConfig) {
      const symbols: string[] = CellConfig[cellType].symbols;
      if (symbols.includes(cellSymbolLetter)) {
        return cellType as CellType;
      }
    }

    return null;
  }

  public static getCellSymbolByType(cellType: CellType): string {
    return CellConfig[cellType].symbols[0];
  }

  public static getCellTypeAndIDBySymbol(symbol: string): ICellTypeWithID {
    const cellType: CellType = CubeHelper.getCellTypeBySymbol(symbol);
    const cellSymbolWithoutNumbers: string = symbol.replace(/[0-9]/g, '');
    const id: number = parseInt(symbol.replace(cellSymbolWithoutNumbers, ''), 10);

    return { cellType, id };
  }

  public static getEnemyConfigByTypeAndID(levelConfig: ILevelConfig, enemyType: CellType, id: number): EnemyConfigMap {
    const enemiesConfigs: EnemyConfigMap[] = levelConfig.enemies[enemyType];
    return enemiesConfigs.filter((config: EnemyConfigMap) => (<any>config).id === id)[0];
  }

  public static getEnemyConfigBySymbol(levelConfig: ILevelConfig, symbol: string): EnemyConfigMap {
    const { cellType, id } = CubeHelper.getCellTypeAndIDBySymbol(symbol);
    return CubeHelper.getEnemyConfigByTypeAndID(levelConfig, cellType, id);
  }

  public static getDangerCellsForWallSpike(wallSpikeConfig: IWallSpikeConfig): THREE.Vector2[] {
    const dangerPositions: THREE.Vector2[] = [];
    const wallSpikePosition: THREE.Vector2 = wallSpikeConfig.position;

    for (let i = 0; i < wallSpikeConfig.directions.length; i++) {
      const direction: Direction = wallSpikeConfig.directions[i];
      const directionPosition: THREE.Vector2 = Direction2DVectorConfig[direction];
      const dangerPosition: THREE.Vector2 = new THREE.Vector2(wallSpikePosition.x + directionPosition.x, wallSpikePosition.y + directionPosition.y);
      dangerPositions.push(dangerPosition);      
    }

    return dangerPositions;
  }
}
