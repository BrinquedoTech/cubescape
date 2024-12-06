import * as THREE from 'three';
import CubeHelper from '../../../Helpers/CubeHelper';
import { CubeSide } from '../../../../Data/Enums/Cube/CubeSide';
import InstancesHelper from '../../../Helpers/InstancesHelper';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { Direction } from '../../../../Data/Enums/Direction';
import MapHelper from '../../../Helpers/MapHelper';
import { CellType } from '../../../../Data/Enums/Cube/CellType';
import GameplayConfig from '../../../../Data/Configs/Main/GameplayConfig';
import { CubeSideAxisConfig, SideVectorConfig } from '../../../../Data/Configs/SideConfig';
import { WallCellGeometryConfig, WallModelsConfig } from '../../../../Data/Configs/Cells/WallCellsConfig';
import Materials from '../../../../Core/Materials';
import { MaterialType } from '../../../../Data/Enums/MaterialType';
import { WallSpikesGeneralConfig } from '../../../../Data/Configs/Enemies/WallSpikesConfig';
import { IWallSpikeConfig } from '../../../../Data/Interfaces/Enemies/IEnemyConfig';
import { ILevelConfig } from '../../../../Data/Interfaces/ILevelConfig';
import { ICubeSideAxisConfig } from '../../../../Data/Interfaces/ICubeConfig';

export default class WallSpikes extends THREE.Group {
  private configs: IWallSpikeConfig[];
  private levelMap: ILevelConfig;
  private wallCellsInstanced: THREE.InstancedMesh;
  private spikesInstanced: THREE.InstancedMesh;

  constructor(configs: IWallSpikeConfig[]) {
    super();

    this.configs = configs;
  }

  public update(_dt: number): void { }

  public init(levelConfig: ILevelConfig): void {
    this.createMap(levelConfig);

    this.initWalls();
    this.initSpikes();
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
        const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[cubeSide][y - 1][x]);
        const wall = this.checkToCreateWall(cellType, cubeSide, x, y, Direction.Up);

        if (wall) {
          wallCells.push(wall);
        }
      }

      if (y < this.levelMap.size.y - 1 && sideMap[y + 1][x] && !config.directions.includes(Direction.Down)) {
        const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[config.side][y + 1][x]);
        const wall = this.checkToCreateWall(cellType, cubeSide, x, y, Direction.Down);

        if (wall) {
          wallCells.push(wall);
        }
      }

      if (x > 0 && sideMap[y][x - 1] && !config.directions.includes(Direction.Left)) {
        const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[config.side][y][x - 1]);
        const wall = this.checkToCreateWall(cellType, cubeSide, x, y, Direction.Left);

        if (wall) {
          wallCells.push(wall);
        }
      }

      if (x < this.levelMap.size.x - 1 && sideMap[y][x + 1] && !config.directions.includes(Direction.Right)) {
        const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[config.side][y][x + 1]);
        const wall = this.checkToCreateWall(cellType, cubeSide, x, y, Direction.Right);

        if (wall) {
          wallCells.push(wall);
        }
      }
    }

    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    const modelName: string = WallModelsConfig.models[0];
    const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
    ThreeJSHelper.setGeometryRotation(geometry, WallCellGeometryConfig.rotation);

    const wallCellsInstanced = this.wallCellsInstanced = InstancesHelper.createStaticInstancedMesh(wallCells, material, geometry);
    this.add(wallCellsInstanced);

    wallCellsInstanced.receiveShadow = true;
    wallCellsInstanced.castShadow = true;
  }

  private initSpikes(): void {
    const spikeObjects = [];

    for (let i = 0; i < this.configs.length; i++) {
      const config: IWallSpikeConfig = this.configs[i];
      const { x, y }: THREE.Vector2 = config.position;
      const cubeSide: CubeSide = config.side;

      for (let i = 0; i < config.directions.length; i++) {
        const direction: Direction = config.directions[i];

        const spike = new THREE.Object3D();

        this.setCellPosition(spike, cubeSide, y, x);
        CubeHelper.setSideRotation(spike, cubeSide);
        CubeHelper.setRotationByDirection(spike, cubeSide, direction);
        spike.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

        spikeObjects.push(spike);
      }
    }

    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('wall_spikes');
    ThreeJSHelper.setGeometryRotation(geometry, WallSpikesGeneralConfig.modelStartRotation);

    const spikesInstanced = this.spikesInstanced = InstancesHelper.createStaticInstancedMesh(spikeObjects, material, geometry);
    this.add(spikesInstanced);

    spikesInstanced.receiveShadow = true;
    spikesInstanced.castShadow = true;
  }

  private checkToCreateWall(cellType: CellType, cubeSide: CubeSide, x: number, y: number, direction: Direction): THREE.Object3D | null {
    if (cellType === CellType.Empty) {
      const wall = new THREE.Object3D();

      this.setCellPosition(wall, cubeSide, y, x);
      CubeHelper.setSideRotation(wall, cubeSide);
      CubeHelper.setRotationByDirection(wall, cubeSide, direction);
      wall.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

      return wall;
    }

    return null;
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
    if (this.wallCellsInstanced) {
      ThreeJSHelper.disposeInstancedMesh(this.wallCellsInstanced);
    }

    if (this.spikesInstanced) {
      ThreeJSHelper.disposeInstancedMesh(this.spikesInstanced);
    }
  }
}
