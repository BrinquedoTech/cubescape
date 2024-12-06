import { CubeSideAxisConfig } from '../../Data/Configs/SideConfig';
import { CubeSide } from '../../Data/Enums/Cube/CubeSide';
import { CellType } from '../../Data/Enums/Cube/CellType';
import { CellsForFinalMap } from '../../Data/Configs/Cells/CellsConfig';
import ArrayHelper from './ArrayHelper';
import { CubeEdge } from '../../Data/Enums/Cube/CubeEdge';
import { EdgeBySideConfig, EdgesBySideArrayConfig } from '../../Data/Configs/Cells/EdgeCellsConfig';
import { CubeEdgeOnSidePositionType } from '../../Data/Enums/Cube/CubeEdgeOnSide';
import CubeHelper from './CubeHelper';
import { FloorCellTypes } from '../../Data/Configs/Cells/FloorCellsConfig';
import { RoofCellTypes } from '../../Data/Configs/Cells/RoofCellsConfig';
import { ILevelConfig, ILevelEdgeConfig, ILevelSideConfig } from '../../Data/Interfaces/ILevelConfig';

export default class MapHelper {
  constructor() {

  }

  public static createFullSideMap(levelConfig: ILevelConfig, cubeSide: CubeSide): string[][] {
    const mapSizeX: number = levelConfig.size[CubeSideAxisConfig[cubeSide].xAxis] + 2;
    const mapSizeY: number = levelConfig.size[CubeSideAxisConfig[cubeSide].yAxis] + 2;

    const sideEdgesMap: ILevelEdgeConfig = {};
    const edgesInSide: CubeEdge[] = EdgesBySideArrayConfig[cubeSide];
    for (let i = 0; i < edgesInSide.length; i++) {
      const edge = edgesInSide[i];
      sideEdgesMap[edge] = [...levelConfig.map.edges[edge]];
    }

    const cellSymbolEmpty: string = CubeHelper.getCellSymbolByType(CellType.Empty);
    const cellSymbolWall: string = CubeHelper.getCellSymbolByType(CellType.Wall);
    const resultMap: string[][] = ArrayHelper.create2DArray(mapSizeY, mapSizeX, cellSymbolEmpty);
    ArrayHelper.fillCornerValues(resultMap, cellSymbolWall);

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

    const sideMap: string[][] = [];

    for (let i = 0; i < levelConfig.map.sides[cubeSide].length; i++) {
      sideMap.push([...levelConfig.map.sides[cubeSide][i]]);
    }

    for (let i = 1; i < mapSizeY - 1; i++) {
      for (let j = 1; j < mapSizeX - 1; j++) {
        const cellSymbolLetter: string = sideMap[i - 1][j - 1].replace(/[0-9]/g, '');
        const currentCellType: CellType = CubeHelper.getCellTypeBySymbol(cellSymbolLetter);

        if (CellsForFinalMap.includes(currentCellType)) {
          resultMap[i][j] = sideMap[i - 1][j - 1];
        }
      }
    }

    return resultMap;
  }

  public static copyMapSidesAndEdges(levelConfig: ILevelConfig): { sides: ILevelSideConfig, edges: ILevelEdgeConfig } {
    const sides: ILevelSideConfig = {};
    const edges: ILevelEdgeConfig = {};

    for (const cubeSide in CubeSide) {
      const side: CubeSide = CubeSide[cubeSide] as CubeSide;
      const sideMap: string[][] = [];

      for (let i = 0; i < levelConfig.map.sides[side].length; i++) {
        sideMap.push([...levelConfig.map.sides[side][i]]);
      }

      sides[side] = sideMap;
    }

    for (const cubeEdge in CubeEdge) {
      const edge: CubeEdge = CubeEdge[cubeEdge] as CubeEdge;
      edges[edge] = [...levelConfig.map.edges[edge]];
    }

    return { sides, edges };
  }

  public static replaceExtraSymbolsInMap(levelConfig: ILevelConfig): void {
    for (const cubeSide in CubeSide) {
      const side: CubeSide = CubeSide[cubeSide] as CubeSide;

      const mapSizeX: number = levelConfig.size[CubeSideAxisConfig[side].xAxis];
      const mapSizeY: number = levelConfig.size[CubeSideAxisConfig[side].yAxis];

      for (let i = 0; i < mapSizeX; i++) {
        for (let j = 0; j < mapSizeY; j++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(levelConfig.map.sides[side][j][i]);

          if (FloorCellTypes.includes(cellType)) {
            const floorCellSymbol: string = CubeHelper.getCellSymbolByType(CellType.Empty);
            levelConfig.map.sides[side][j][i] = floorCellSymbol;
          }

          if (RoofCellTypes.includes(cellType)) {
            const roofCellSymbol: string = CubeHelper.getCellSymbolByType(CellType.Wall);
            levelConfig.map.sides[side][j][i] = roofCellSymbol;
          }
        }
      }
    }
  }

  public static removeEnemiesIndexesFromMap(levelConfig: ILevelConfig): void {
    for (const cubeSide in CubeSide) {
      const side: CubeSide = CubeSide[cubeSide] as CubeSide;

      const mapSizeX: number = levelConfig.size[CubeSideAxisConfig[side].xAxis];
      const mapSizeY: number = levelConfig.size[CubeSideAxisConfig[side].yAxis];

      for (let i = 0; i < mapSizeX; i++) {
        for (let j = 0; j < mapSizeY; j++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(levelConfig.map.sides[side][j][i]);

          if (cellType === CellType.FloorSpike) {
            levelConfig.map.sides[side][j][i] = CubeHelper.getCellSymbolByType(CellType.FloorSpike);
          }

          if (cellType === CellType.WallSpike) {
            levelConfig.map.sides[side][j][i] = CubeHelper.getCellSymbolByType(CellType.WallSpike);
          }
        }
      }
    }
  }
}
