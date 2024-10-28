import * as THREE from 'three';
import { IWallSpikeConfig } from '../../../Interfaces/IEnemyConfig';
import CubeHelper from '../../../Helpers/CubeHelper';
import { CubeSide } from '../../../Enums/CubeSide';
import { ILevelConfig } from '../../../Interfaces/ILevelConfig';
import InstancesHelper from '../../../Helpers/InstancesHelper';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { Direction } from '../../../Enums/Direction';
import { WallSpikeType } from '../../../Enums/WallSpikeType';
import MapHelper from '../../../Helpers/MapHelper';
import { CellType } from '../../../Enums/CellType';
import GameplayConfig from '../../../Configs/Main/GameplayConfig';
import { ICubeSideAxisConfig } from '../../../Interfaces/ICubeConfig';
import { CubeSideAxisConfig, SideVectorConfig } from '../../../Configs/SideConfig';
import { WallCellGeometryConfig, WallModelsConfig } from '../../../Configs/Cells/WallCellsConfig';
import Materials from '../../../../core/Materials';
import { MaterialType } from '../../../Enums/MaterialType';

// type ConfigByType = { [key in WallSpikeType]?: IWallSpikeConfig[] };

export default class WallSpikes extends THREE.Group {
  private configs: IWallSpikeConfig[];
  private levelMap: ILevelConfig;
  private wallSpikesInstancedByType: { [key in WallSpikeType]?: THREE.InstancedMesh } = {};

  constructor(configs: IWallSpikeConfig[]) {
    super();

    this.configs = configs;
  }

  public update(_dt: number): void {

  }

  public init(levelConfig: ILevelConfig): void {

    this.createMap(levelConfig);

    this.initWalls();



    // const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    // const configByType: ConfigByType = this.createConfigByType();

    // for (let wallSpikeType in configByType) {
    //   const wallSpikeObjects: THREE.Object3D[] = [];
    //   const configsByType: IWallSpikeConfig[] = configByType[wallSpikeType];

    //   const modelName: string = WallSpikesTypeConfig[wallSpikeType].model;
    //   const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
    //   ThreeJSHelper.setGeometryRotation(geometry, WallSpikesGeneralConfig.modelStartRotation);

    //   for (let i = 0; i < configsByType.length; i++) {
    //     const config: IWallSpikeConfig = configsByType[i];
    //     const sidePosition: THREE.Vector2 = config.position;
    //     const side: CubeSide = config.side;

    //     const wallSpike: THREE.Object3D = new THREE.Object3D();

    //     const position: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);
    //     wallSpike.position.copy(position);

    //     const wallsSpikeModelDirection: Direction = this.getWallSpikeModelDirection(config.directions);
    //     CubeHelper.setSideRotation(wallSpike, side);
    //     CubeHelper.setRotationByDirection(wallSpike, side, wallsSpikeModelDirection);

    //     wallSpikeObjects.push(wallSpike);
    //   }

    //   const wallSpikesInstanced = InstancesHelper.createStaticInstancedMesh(wallSpikeObjects, material, geometry);
    //   this.add(wallSpikesInstanced);
    //   this.wallSpikesInstancedByType[wallSpikeType] = wallSpikesInstanced;
    // }
  }

  private createMap(levelConfig: ILevelConfig): void {
    const { sides, edges } = MapHelper.copyMapSidesAndEdges(levelConfig);

    this.levelMap = {
      size: new THREE.Vector3(levelConfig.size.x, levelConfig.size.y, levelConfig.size.z),
      map: { sides, edges },
    };

    MapHelper.replaceExtraSymbolsInMap(this.levelMap);
  }

  private initWalls(): void {
    const wallCells = [];

    for (let i = 0; i < this.configs.length; i++) {
      const config: IWallSpikeConfig = this.configs[i];

      const { x, y }: THREE.Vector2 = config.position;
      const cubeSide: CubeSide = config.side;

      const sideMap: string[][] = this.levelMap.map.sides[cubeSide];

      if (y > 0 && sideMap[y - 1][x] && !config.directions.includes(Direction.Up)) {
        const direction: Direction = Direction.Up;
        const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[cubeSide][y - 1][x]);

        if (cellType === CellType.Empty) {
          const wall = new THREE.Object3D();

          this.setCellPosition(wall, cubeSide, y, x);
          CubeHelper.setSideRotation(wall, cubeSide);
          CubeHelper.setRotationByDirection(wall, cubeSide, direction);
          wall.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

          wallCells.push(wall);
        }
      }

      if (y < this.levelMap.size.y - 1 && sideMap[y + 1][x] && !config.directions.includes(Direction.Down)) {
        const direction: Direction = Direction.Down;
        const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[config.side][y + 1][x]);

        if (cellType === CellType.Empty) {
          const wall = new THREE.Object3D();

          this.setCellPosition(wall, cubeSide, y, x);
          CubeHelper.setSideRotation(wall, cubeSide);
          CubeHelper.setRotationByDirection(wall, cubeSide, direction);
          wall.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

          wallCells.push(wall);
        }
      }

      if (x > 0 && sideMap[y][x - 1] && !config.directions.includes(Direction.Left)) {
        const direction: Direction = Direction.Left;
        const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[config.side][y][x - 1]);

        if (cellType === CellType.Empty) {
          const wall = new THREE.Object3D();

          this.setCellPosition(wall, cubeSide, y, x);
          CubeHelper.setSideRotation(wall, cubeSide);
          CubeHelper.setRotationByDirection(wall, cubeSide, direction);
          wall.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

          wallCells.push(wall);
        }
      }

      if (x < this.levelMap.size.x - 1 && sideMap[y][x + 1] && !config.directions.includes(Direction.Right)) {
        const direction: Direction = Direction.Right;
        const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[config.side][y][x + 1]);

        if (cellType === CellType.Empty) {
          const wall = new THREE.Object3D();

          this.setCellPosition(wall, cubeSide, y, x);
          CubeHelper.setSideRotation(wall, cubeSide);
          CubeHelper.setRotationByDirection(wall, cubeSide, direction);
          wall.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

          wallCells.push(wall);
        }
      }
    }

    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    const modelName: string = WallModelsConfig.models[0];
    const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
    ThreeJSHelper.setGeometryRotation(geometry, WallCellGeometryConfig.rotation);

    const wallCellsInstanced = InstancesHelper.createStaticInstancedMesh(wallCells, material, geometry);
    this.add(wallCellsInstanced);

    wallCellsInstanced.receiveShadow = true;
    wallCellsInstanced.castShadow = true;
  }

  private setCellPosition(cell: THREE.Object3D, cubeSide: CubeSide, x: number, y: number): void {
    const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];

    const distance: number = (this.levelMap.size[cubeSideAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;
    const offsetX: number = (this.levelMap.size[cubeSideAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
    const offsetY: number = (this.levelMap.size[cubeSideAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;

    cell.position.x = SideVectorConfig[cubeSide].x * distance;
    cell.position.y = SideVectorConfig[cubeSide].y * distance;
    cell.position.z = SideVectorConfig[cubeSide].z * distance;

    cell.position[cubeSideAxisConfig.xAxis] += y * GameplayConfig.grid.size * cubeSideAxisConfig.xFactor - offsetX * cubeSideAxisConfig.xFactor;
    cell.position[cubeSideAxisConfig.yAxis] += x * GameplayConfig.grid.size * cubeSideAxisConfig.yFactor - offsetY * cubeSideAxisConfig.yFactor;
  }

  public kill(): void {
    for (let wallSpikeType in this.wallSpikesInstancedByType) {
      const instancedMesh: THREE.InstancedMesh = this.wallSpikesInstancedByType[wallSpikeType];
      ThreeJSHelper.killInstancedMesh(instancedMesh, this);
    }
  }

  // private createConfigByType(): ConfigByType {
  //   const configByType: ConfigByType = {};

  //   for (let i = 0; i < this.configs.length; i++) {
  //     const config: IWallSpikeConfig = this.configs[i];
  //     const wallSpikeType: WallSpikeType = this.getWallSpikeType(config.directions);

  //     if (configByType[wallSpikeType]) {
  //       configByType[wallSpikeType].push(config);
  //     } else {
  //       configByType[wallSpikeType] = [config];
  //     }
  //   }

  //   return configByType;
  // }

  // private getWallSpikeModelDirection(directions: Direction[]): Direction {
  //   const wallSpikeType: WallSpikeType = this.getWallSpikeType(directions);
  //   const wallSpikeTypeConfig: IWallSpikesTypesConfig = WallSpikesTypeConfig[wallSpikeType];

  //   for (let i = 0; i < wallSpikeTypeConfig.mainDirection.length; i++) {
  //     const directionConfig: IWallSpikeByTypeDirections = wallSpikeTypeConfig.mainDirection[i];

  //     if (ArrayHelper.isArraysHasSameValues(directionConfig.type, directions)) {
  //       return directionConfig.modelDirection;
  //     }
  //   }

  //   return null;
  // }

  // private getWallSpikeType(directions: Direction[]): WallSpikeType {
  //   for (let type in WallSpikeType) {
  //     const wallSpikeType: WallSpikeType = WallSpikeType[type];
  //     const wallSpikeConfig: IWallSpikesTypesConfig = WallSpikesTypeConfig[wallSpikeType];
  //     const rule: IWallSpikeTypeRule = wallSpikeConfig.rule;

  //     if (rule.directionsCount === directions.length) {
  //       let isMatch: boolean = true;

  //       if (rule.directions) {
  //         let isDirectionsMatch: boolean = false;
  //         for (let i = 0; i < rule.directions.length; i++) {
  //           const ruleDirections: Direction[] = rule.directions[i];

  //           if (ArrayHelper.isArraysHasSameValues(ruleDirections, directions)) {
  //             isDirectionsMatch = true;
  //             break;
  //           }
  //         }

  //         isMatch = isDirectionsMatch;
  //       }

  //       if (isMatch) {
  //         return wallSpikeType;
  //       }
  //     }
  //   }

  //   return null;
  // }
}
