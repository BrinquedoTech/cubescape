import * as THREE from 'three';
import { EdgeBySideConfig, EdgesBySideArrayConfig } from "../Configs/EdgeConfig";
import { CubeSideAxisConfig } from "../Configs/SideConfig";
import { CellType } from "../Enums/CellType";
import { CubeEdge } from "../Enums/CubeEdge";
import { CubeEdgeOnSidePositionType } from "../Enums/CubeEdgeOnSide";
import { CubeSide } from "../Enums/CubeSide";
import ArrayHelper from "../Helpers/ArrayHelper";
import { ILevelConfig, ILevelEdgeConfig, IMapConfig } from "../Interfaces/ILevelConfig";
import CubeHelper from '../Helpers/CubeHelper';
import { CellsForFinalMap } from '../Configs/CellsConfig';

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
      this.map[side] = this.createFullSideMap(side);
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

  private createFullSideMap(cubeSide: CubeSide): string[][] {
    const mapSizeX: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].xAxis] + 2;
    const mapSizeY: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].yAxis] + 2;

    const sideEdgesMap: ILevelEdgeConfig = {};
    const edgesInSide: CubeEdge[] = EdgesBySideArrayConfig[cubeSide];
    for (let i = 0; i < edgesInSide.length; i++) {
      const edge = edgesInSide[i];
      sideEdgesMap[edge] = this.levelConfig.map.edges[edge];
    }

    const cellSymbol: string = CubeHelper.getCellSymbolByType(CellType.Empty);
    const resultMap: string[][] = ArrayHelper.create2DArray(mapSizeY, mapSizeX, cellSymbol);
    ArrayHelper.fillCornerValues(resultMap, cellSymbol);

    for (const edgeType in sideEdgesMap) {
      const { positionType, direction } = EdgeBySideConfig[cubeSide][edgeType];
      let edgeMap: string[] = [...sideEdgesMap[edgeType]];
      edgeMap = direction === 1 ? edgeMap : edgeMap.reverse();

      switch (positionType) {
        case CubeEdgeOnSidePositionType.Top:
          for (let i = 1; i < mapSizeX - 1; i++)
            resultMap[0][i] = edgeMap[i - 1];
          break;
        case CubeEdgeOnSidePositionType.Down:
          for (let i = 1; i < mapSizeX - 1; i++)
            resultMap[mapSizeY - 1][i] = edgeMap[i - 1];
          break;
        case CubeEdgeOnSidePositionType.Left:
          for (let i = 1; i < mapSizeY - 1; i++)
            resultMap[i][0] = edgeMap[i - 1];
          break;
        case CubeEdgeOnSidePositionType.Right:
          for (let i = 1; i < mapSizeY - 1; i++)
            resultMap[i][mapSizeX - 1] = edgeMap[i - 1];
          break;
      }
    }

    const sideMap: string[][] = this.levelConfig.map.sides[cubeSide];
    const symbolsForFinalMap: string[] = CellsForFinalMap.map((cell: CellType) => CubeHelper.getCellSymbolByType(cell));

    for (let i = 1; i < mapSizeY - 1; i++) {
      for (let j = 1; j < mapSizeX - 1; j++) {
        const cellSymbolLetter: string = sideMap[i - 1][j - 1].replace(/[0-9]/g, '');

        if (symbolsForFinalMap.includes(cellSymbolLetter)) {
          resultMap[i][j] = sideMap[i - 1][j - 1];
        }
      }
    }

    return resultMap;
  }
}
