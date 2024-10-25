import * as THREE from 'three';
import Loader from '../../../core/loader';
import ThreeJSHelper from '../../Helpers/ThreeJSHelper';
import GameplayConfig from '../../Configs/Main/GameplayConfig';
import { ILevelConfig, ILevelEdgeConfig, ILevelMapConfig } from '../../Interfaces/ILevelConfig';
import CornerCellsConfig from '../../Configs/Cells/CornerCellsConfig';
import { EdgeRotationConfig, EdgeDistanceConfig, EdgeModelsConfig } from '../../Configs/Cells/EdgeCellsConfig';
import { ICubeSideAxisConfig, IEdgeConfig } from '../../Interfaces/ICubeConfig';
import CubeHelper from '../../Helpers/CubeHelper';
import { CellType } from '../../Enums/CellType';
import InstancesHelper from '../../Helpers/InstancesHelper';
import { CubeSideAxisConfig, SideVectorConfig } from '../../Configs/SideConfig';
import { CubeSide } from '../../Enums/CubeSide';
import { FloorCellsGeometryConfig, FloorCellTypes, FloorModelsConfig } from '../../Configs/Cells/FloorCellsConfig';
import { RoofCellsGeometryConfig, RoofCellTypes, RoofModelsConfig } from '../../Configs/Cells/RoofCellsConfig';
import { CubeEdge } from '../../Enums/CubeEdge';
import { WallCellDirection } from '../../Enums/WallCellDirection';
import { Direction } from '../../Enums/Direction';

export default class CubeViewBuilder extends THREE.Group {
  private mainMaterial: THREE.MeshStandardMaterial;
  private levelMap: ILevelConfig;

  private corners: THREE.Mesh[] = [];
  private edgeCellsInstanced: THREE.InstancedMesh[] = [];

  constructor() {
    super();

    this.initMaterial();
  }

  public init(levelConfig: ILevelConfig): void {
    this.createLevelMap(levelConfig);

    this.initCorners();
    this.initEdges();
    this.initFloor();
    this.initRoof();
    this.initWalls();
    // this.initSides();
  }

  public removeView(): void {
    ThreeJSHelper.killObjects(this.corners, this);

    for (let i = 0; i < this.edgeCellsInstanced.length; i++) {
      ThreeJSHelper.killInstancedMesh(this.edgeCellsInstanced[i], this);
    }

    this.corners = [];
    this.edgeCellsInstanced = [];
  }

  private createLevelMap(levelConfig: ILevelConfig): void {
    this.copyLevelMap(levelConfig);
    
    for (const cubeSide in CubeSide) {
      const side: CubeSide = CubeSide[cubeSide] as CubeSide;

      const mapSizeX: number = levelConfig.size[CubeSideAxisConfig[side].xAxis];
      const mapSizeY: number = levelConfig.size[CubeSideAxisConfig[side].yAxis];
      
      for (let i = 0; i < mapSizeX; i++) {
        for (let j = 0; j < mapSizeY; j++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[side][j][i]);

          if (FloorCellTypes.includes(cellType)) {
            const floorCellSymbol: string = CubeHelper.getCellSymbolByType(CellType.Empty);
            this.levelMap.map.sides[side][j][i] = floorCellSymbol;
          }

          if (RoofCellTypes.includes(cellType)) {
            const roofCellSymbol: string = CubeHelper.getCellSymbolByType(CellType.Wall);
            this.levelMap.map.sides[side][j][i] = roofCellSymbol;
          }
        }
      }
    }
  }

  private copyLevelMap(levelConfig: ILevelConfig): void {
    this.levelMap = {
      size: levelConfig.size,
      map: {
        sides: {},
        edges: {},
      },
    };

    for (const cubeSide in CubeSide) {
      const side: CubeSide = CubeSide[cubeSide] as CubeSide;
      const sideMap: string[][] = [];

      for (let i = 0; i < levelConfig.map.sides[side].length; i++) {
        sideMap.push([...levelConfig.map.sides[side][i]]);
      }

      this.levelMap.map.sides[side] = sideMap;
    }

    for (const cubeEdge in CubeEdge) {
      const edge: CubeEdge = CubeEdge[cubeEdge] as CubeEdge;
      this.levelMap.map.edges[edge] = [...levelConfig.map.edges[edge]];
    }
  }

  private initCorners(): void {
    const distance = new THREE.Vector3(
      (this.levelMap.size.x + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelMap.size.y + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelMap.size.z + 1) * 0.5 * GameplayConfig.grid.size,
    );

    for (let i = 0; i < CornerCellsConfig.length; i++) {
      const cornerConfig = CornerCellsConfig[i];

      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(cornerConfig.model);

      const cornerCell = new THREE.Mesh(geometry, this.mainMaterial);
      this.add(cornerCell);

      cornerCell.position.x = cornerConfig.position.x * distance.x;
      cornerCell.position.y = cornerConfig.position.y * distance.y;
      cornerCell.position.z = cornerConfig.position.z * distance.z;

      cornerCell.rotation.x = cornerConfig.rotation.x;
      cornerCell.rotation.y = cornerConfig.rotation.y;
      cornerCell.rotation.z = cornerConfig.rotation.z;

      cornerCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

      this.corners.push(cornerCell);
    }
  }

  private initEdges(): void {
    const distance = new THREE.Vector3(
      (this.levelMap.size.x + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelMap.size.y + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelMap.size.z + 1) * 0.5 * GameplayConfig.grid.size,
    );

    const edgeCells: THREE.Object3D[] = [];

    for (let i = 0; i < EdgeRotationConfig.length; i++) {
      const edgeConfig: IEdgeConfig = EdgeRotationConfig[i];
      const edgeSize: number = this.levelMap.size[edgeConfig.axis];

      for (let j = 0; j < edgeSize; j++) {
        if (CubeHelper.getCellTypeBySymbol(this.levelMap.map.edges[edgeConfig.edge][j]) === CellType.Wall) {
          const edgeCell = new THREE.Object3D();

          edgeCell.position.x = EdgeDistanceConfig[i].x * distance.x;
          edgeCell.position.y = EdgeDistanceConfig[i].y * distance.y;
          edgeCell.position.z = EdgeDistanceConfig[i].z * distance.z;

          edgeCell.position[edgeConfig.axis] += j * GameplayConfig.grid.size + GameplayConfig.grid.size * 0.5 - edgeSize * 0.5 * GameplayConfig.grid.size;

          edgeCell.rotation.x = edgeConfig.rotation.x;
          edgeCell.rotation.y = edgeConfig.rotation.y;
          edgeCell.rotation.z = edgeConfig.rotation.z;

          edgeCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

          edgeCells.push(edgeCell);
        }
      }
    }

    const edgeCellsByProbability: THREE.Object3D[][] = ThreeJSHelper.splitObjectsByProbability(edgeCells, EdgeModelsConfig.probabilities);

    for (let i = 0; i < EdgeModelsConfig.models.length; i++) {
      const modelName: string = EdgeModelsConfig.models[i];
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      const edgeCells: THREE.Object3D[] = edgeCellsByProbability[i];

      const edgeCellsInstanced = InstancesHelper.createStaticInstancedMesh(edgeCells, this.mainMaterial, geometry);
      this.add(edgeCellsInstanced);

      this.edgeCellsInstanced.push(edgeCellsInstanced);

      edgeCellsInstanced.receiveShadow = true;
      edgeCellsInstanced.castShadow = true;
    }
  }

  private initFloor(): void {
    const floorCells = [];

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const sizeX: number = this.levelMap.size[cubeSideAxisConfig.xAxis];
      const sizeY: number = this.levelMap.size[cubeSideAxisConfig.yAxis];

      for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[cubeSide][i][j]);

          if (cellType === CellType.Empty) {
            const floor = new THREE.Object3D();

            const distance: number = (this.levelMap.size[cubeSideAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;
            const offsetX: number = (this.levelMap.size[cubeSideAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
            const offsetY: number = (this.levelMap.size[cubeSideAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;

            floor.position.x = SideVectorConfig[cubeSide].x * distance;
            floor.position.y = SideVectorConfig[cubeSide].y * distance;
            floor.position.z = SideVectorConfig[cubeSide].z * distance;

            floor.position[cubeSideAxisConfig.xAxis] += j * GameplayConfig.grid.size * cubeSideAxisConfig.xFactor - offsetX * cubeSideAxisConfig.xFactor;
            floor.position[cubeSideAxisConfig.yAxis] += i * GameplayConfig.grid.size * cubeSideAxisConfig.yFactor - offsetY * cubeSideAxisConfig.yFactor;

            CubeHelper.setSideRotation(floor, cubeSide);

            floor.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

            floorCells.push(floor);
          }
        }
      }
    }

    const floorCellsByProbability: THREE.Object3D[][] = ThreeJSHelper.splitObjectsByProbability(floorCells, FloorModelsConfig.probabilities);

    for (let i = 0; i < FloorModelsConfig.models.length; i++) {
      const modelName: string = FloorModelsConfig.models[i];
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      ThreeJSHelper.setGeometryRotation(geometry, FloorCellsGeometryConfig.rotation);
      const floorCells: THREE.Object3D[] = floorCellsByProbability[i];

      const floorCellsInstanced = InstancesHelper.createStaticInstancedMesh(floorCells, this.mainMaterial, geometry);
      this.add(floorCellsInstanced);

      floorCellsInstanced.receiveShadow = true;
    }
  }

  private initRoof(): void {
    const roofCells = [];

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const sizeX: number = this.levelMap.size[cubeSideAxisConfig.xAxis];
      const sizeY: number = this.levelMap.size[cubeSideAxisConfig.yAxis];

      for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[cubeSide][i][j]);

          if (cellType === CellType.Wall) {
            const roof = new THREE.Object3D();

            const distance: number = (this.levelMap.size[cubeSideAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;
            const offsetX: number = (this.levelMap.size[cubeSideAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
            const offsetY: number = (this.levelMap.size[cubeSideAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;

            roof.position.x = SideVectorConfig[cubeSide].x * distance;
            roof.position.y = SideVectorConfig[cubeSide].y * distance;
            roof.position.z = SideVectorConfig[cubeSide].z * distance;

            roof.position[cubeSideAxisConfig.xAxis] += j * GameplayConfig.grid.size * cubeSideAxisConfig.xFactor - offsetX * cubeSideAxisConfig.xFactor;
            roof.position[cubeSideAxisConfig.yAxis] += i * GameplayConfig.grid.size * cubeSideAxisConfig.yFactor - offsetY * cubeSideAxisConfig.yFactor;

            CubeHelper.setSideRotation(roof, cubeSide);

            roof.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

            roofCells.push(roof);
          }
        }
      }
    }

    const roofCellsByProbability: THREE.Object3D[][] = ThreeJSHelper.splitObjectsByProbability(roofCells, RoofModelsConfig.probabilities);

    for (let i = 0; i < RoofModelsConfig.models.length; i++) {
      const modelName: string = RoofModelsConfig.models[i];
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      ThreeJSHelper.setGeometryRotation(geometry, RoofCellsGeometryConfig.rotation);
      const roofCells: THREE.Object3D[] = roofCellsByProbability[i];

      const roofCellsInstanced = InstancesHelper.createStaticInstancedMesh(roofCells, this.mainMaterial, geometry);
      this.add(roofCellsInstanced);

      roofCellsInstanced.receiveShadow = true;
      roofCellsInstanced.castShadow = true;
    }
  }

  private initWalls(): void {
    const wallCells = [];

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const sizeX: number = this.levelMap.size[cubeSideAxisConfig.xAxis];
      const sizeY: number = this.levelMap.size[cubeSideAxisConfig.yAxis];

      for (let row = 0; row < sizeY; row++) {
        for (let column = 0; column < sizeX; column++) {
          const cellType: CellType = CubeHelper.getCellTypeBySymbol(this.levelMap.map.sides[cubeSide][row][column]);

          if (cellType === CellType.Wall) {
            const wallDirections: Direction[] = this.getWallDirections(this.levelMap.map.sides[cubeSide], row, column);

            for (let i = 0; i < wallDirections.length; i++) {
              const wallDirection: Direction = wallDirections[i];
              
              const wall = new THREE.Object3D();

              const distance: number = (this.levelMap.size[cubeSideAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;
              const offsetX: number = (this.levelMap.size[cubeSideAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
              const offsetY: number = (this.levelMap.size[cubeSideAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;

              wall.position.x = SideVectorConfig[cubeSide].x * distance;
              wall.position.y = SideVectorConfig[cubeSide].y * distance;
              wall.position.z = SideVectorConfig[cubeSide].z * distance;

              wall.position[cubeSideAxisConfig.xAxis] += column * GameplayConfig.grid.size * cubeSideAxisConfig.xFactor - offsetX * cubeSideAxisConfig.xFactor;
              wall.position[cubeSideAxisConfig.yAxis] += row * GameplayConfig.grid.size * cubeSideAxisConfig.yFactor - offsetY * cubeSideAxisConfig.yFactor;

              CubeHelper.setSideRotation(wall, cubeSide);
              CubeHelper.setRotationByDirection(wall, cubeSide, wallDirection);

              wall.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

              wallCells.push(wall);
            }
          }
        }
      }
    }

    const modelName: string = 'wall_01';
    const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
    ThreeJSHelper.setGeometryRotation(geometry, new THREE.Euler(Math.PI * 0.5, 0, 0));

    const roofCellsInstanced = InstancesHelper.createStaticInstancedMesh(wallCells, this.mainMaterial, geometry);
    this.add(roofCellsInstanced);
  }

  private getWallDirections(map: string[][], row: number, column: number): Direction[] {
    const neighboursCells: Direction[] = [];
    const cellTypeToCheck: CellType = CellType.Empty;
    const cellTypeToCheckSymbol: string = CubeHelper.getCellSymbolByType(cellTypeToCheck);

    if (row > 0 && map[row - 1][column] === cellTypeToCheckSymbol) {
      neighboursCells.push(Direction.Up);
    }

    if (row < map.length - 1 && map[row + 1][column] === cellTypeToCheckSymbol) {
      neighboursCells.push(Direction.Down);
    }

    if (column > 0 && map[row][column - 1] === cellTypeToCheckSymbol) {
      neighboursCells.push(Direction.Left);
    }

    if (column < map[0].length - 1 && map[row][column + 1] === cellTypeToCheckSymbol) {
      neighboursCells.push(Direction.Right);
    }

    return neighboursCells;

  }

  private initMaterial(): void {
    const texture = Loader.assets['dungeon_texture'];
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    this.mainMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
  }
}