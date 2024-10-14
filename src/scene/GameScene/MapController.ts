import * as THREE from 'three';
import { EdgeBySideConfig, EdgesBySideArrayConfig } from "../Configs/EdgeConfig";
import { CubeSideAxisConfig } from "../Configs/SideConfig";
import { CellType } from "../Enums/CellType";
import { CubeEdge } from "../Enums/CubeEdge";
import { CubeEdgeOnSidePositionType } from "../Enums/CubeEdgeOnSide";
import { CubeSide } from "../Enums/CubeSide";
import ArrayHelper from "../Helpers/ArrayHelper";
import { ILevelConfig, ILevelEdgeConfig, IMapConfig } from "../Interfaces/ILevelConfig";

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

  public getSideMap(cubeSide: CubeSide): CellType[][] {
    return this.map[cubeSide] as CellType[][];
  }

  public getCellType(cubeSide: CubeSide, x: number, y: number): CellType {
    return this.map[cubeSide][y][x] as CellType;
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

  private createFullSideMap(cubeSide: CubeSide): CellType[][] {
    const mapSizeX: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].xAxis] + 2;
    const mapSizeY: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].yAxis] + 2;

    const sideEdgesMap: ILevelEdgeConfig = {};
    const edgesInSide: CubeEdge[] = EdgesBySideArrayConfig[cubeSide];
    for (let i = 0; i < edgesInSide.length; i++) {
      const edge = edgesInSide[i];
      sideEdgesMap[edge] = this.levelConfig.map.edges[edge];
    }

    const resultMap: CellType[][] = ArrayHelper.create2DArray(mapSizeY, mapSizeX, CellType.Empty);
    ArrayHelper.fillCornerValues(resultMap, CellType.Wall);

    for (const edgeType in sideEdgesMap) {
      const { positionType, direction } = EdgeBySideConfig[cubeSide][edgeType];
      let edgeMap: CellType[] = [...sideEdgesMap[edgeType]];
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

    const sideMap: CellType[][] = this.levelConfig.map.sides[cubeSide] as CellType[][];

    for (let i = 1; i < mapSizeY - 1; i++) {
      for (let j = 1; j < mapSizeX - 1; j++) {
        if (sideMap[i - 1][j - 1] === CellType.Wall || sideMap[i - 1][j - 1] === CellType.Finish) {
          resultMap[i][j] = sideMap[i - 1][j - 1];
        }
      }
    }

    return resultMap;
  }
}
