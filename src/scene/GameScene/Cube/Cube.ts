import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import GameplayConfig from '../../Configs/Main/GameplayConfig';
import CornerCellsConfig from '../../Configs/CornerCellsConfig';
import { EdgeAxisConfig, EdgeDistanceConfig } from '../../Configs/EdgeConfig';
import { CubeSideAxisConfig, SideVectorConfig } from '../../Configs/SideConfig';
import { IEdgeAxisConfig, ICubeSideAxisConfig } from '../../Interfaces/ICubeConfig';
import { RotateDirection, TurnDirection } from '../../Enums/RotateDirection';
import CubeRotationController from './CubeRotationController';
import { CubeSide } from '../../Enums/CubeSide';
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';
import { CubeState } from '../../Enums/CubeState';
import CubeDebug from './CubeDebug';
import mitt, { Emitter } from 'mitt';
import { DefaultStartSideConfig } from '../../Configs/StartSideConfig';
import ThreeJSHelper from '../../Helpers/ThreeJSHelper';
import { CellType } from '../../Enums/CellType';
import InstancesHelper from '../../Helpers/InstancesHelper';
import CubeHelper from '../../Helpers/CubeHelper';

type Events = {
  endRotating: string;
};

export default class Cube extends THREE.Group {
  private levelConfig: ILevelConfig;
  private cubeRotationController: CubeRotationController;
  private cubeDebug: CubeDebug;
  private state: CubeState = CubeState.Idle;

  private innerCube: THREE.Mesh;
  private cornerCellsInstanced: THREE.InstancedMesh;
  private edgeCellsInstanced: THREE.InstancedMesh;
  private sideCellsInstanced: THREE.InstancedMesh;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.initCubeRotationController();
    this.initCubeDebug();
    this.hide();
  }

  public update(dt: number): void {
    this.cubeRotationController.update(dt);
  }

  public rotateToDirection(rotateDirection: RotateDirection): void {
    this.state = CubeState.Rotating;
    this.cubeRotationController.rotateToDirection(rotateDirection);
  }

  public turn(turnDirection: TurnDirection): void {
    this.state = CubeState.Rotating;
    this.cubeRotationController.turn(turnDirection);
  }

  public getCurrentSide(): CubeSide {
    return this.cubeRotationController.getCurrentSide();
  }

  public getCurrentRotationDirection(): CubeRotationDirection {
    return this.cubeRotationController.getCurrentRotationDirection();
  }

  public getState(): CubeState {
    return this.state;
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.initInnerCube();
    this.initEdges();
    this.initSides();
    this.setStartSide();
    this.show();
    
    this.cubeDebug.setLevelConfig(levelConfig);
  }

  public reset(): void {
    this.levelConfig = null;
    this.state = CubeState.Idle;
    this.cubeRotationController.reset();
  }

  public removeCube(): void {
    ThreeJSHelper.killInstancedMesh(this.cornerCellsInstanced, this);
    ThreeJSHelper.killInstancedMesh(this.edgeCellsInstanced, this);
    ThreeJSHelper.killInstancedMesh(this.sideCellsInstanced, this);
    ThreeJSHelper.killObjects(this.innerCube, this);

    this.cornerCellsInstanced = null;
    this.edgeCellsInstanced = null;
    this.sideCellsInstanced = null;
    this.innerCube = null;

    this.cubeDebug.removeDebug();
  }

  private initCubeRotationController(): void {
    this.cubeRotationController = new CubeRotationController(this);

    this.cubeRotationController.emitter.on('endRotating', () => {
      this.state = CubeState.Idle;
      this.emitter.emit('endRotating');
    });
  }

  private initCubeDebug(): void {
    const cubeDebug = this.cubeDebug = new CubeDebug();
    this.add(cubeDebug);
  }

  private setStartSide(): void {
    const defaultSide: CubeSide = DefaultStartSideConfig.side;
    const defaultRotationDirection: CubeRotationDirection = DefaultStartSideConfig.rotationDirection;

    let startSide: CubeSide = defaultSide;
    let startCubeRotationDirection: CubeRotationDirection = defaultRotationDirection;

    if (this.levelConfig.startSide) {
      startSide = this.levelConfig.startSide.side ?? defaultSide;
      startCubeRotationDirection = this.levelConfig.startSide.rotationDirection ?? defaultRotationDirection;
    }

    this.cubeRotationController.setInitRotation(startSide, startCubeRotationDirection);
  }

  private initInnerCube(): void {
    const innerCubeSize = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.grid.size,
      this.levelConfig.size.y * GameplayConfig.grid.size,
      this.levelConfig.size.z * GameplayConfig.grid.size,
    );

    const geometry = new THREE.BoxGeometry(innerCubeSize.x, innerCubeSize.y, innerCubeSize.z);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const innerCube = this.innerCube = new THREE.Mesh(geometry, material);
    this.add(innerCube);
  }

  private initEdges(): void {
    this.initCornersCells();
    this.initEdgeCells();
  }

  private initCornersCells(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.grid.size, GameplayConfig.grid.size, GameplayConfig.grid.size);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });

    const distance = new THREE.Vector3(
      (this.levelConfig.size.x + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelConfig.size.y + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelConfig.size.z + 1) * 0.5 * GameplayConfig.grid.size,
    );

    const cornerCells: THREE.Object3D[] = [];
    
    for (let i = 0; i < CornerCellsConfig.length; i++) {
      const cornerCell = new THREE.Object3D();
      cornerCell.position.x = CornerCellsConfig[i].x * distance.x;
      cornerCell.position.y = CornerCellsConfig[i].y * distance.y;
      cornerCell.position.z = CornerCellsConfig[i].z * distance.z;

      cornerCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

      cornerCells.push(cornerCell);
    }

    const cornerCellsInstanced = this.cornerCellsInstanced = InstancesHelper.createStaticInstancedMesh(cornerCells, material, geometry);
    this.add(cornerCellsInstanced);
  }

  private initEdgeCells(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.grid.size, GameplayConfig.grid.size, GameplayConfig.grid.size);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });

    const distance = new THREE.Vector3(
      (this.levelConfig.size.x + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelConfig.size.y + 1) * 0.5 * GameplayConfig.grid.size,
      (this.levelConfig.size.z + 1) * 0.5 * GameplayConfig.grid.size,
    );

    const edgeCells: THREE.Object3D[] = [];

    for (let i = 0; i < EdgeAxisConfig.length; i++) {
      const edgeAxisConfig: IEdgeAxisConfig = EdgeAxisConfig[i];
      const edgeSize: number = this.levelConfig.size[edgeAxisConfig.axis];
      
      for (let j = 0; j < edgeSize; j++) {
        if (CubeHelper.getCellTypeBySymbol(this.levelConfig.map.edges[edgeAxisConfig.edge][j]) === CellType.Wall) {
          const edgeCell = new THREE.Object3D();

          edgeCell.position.x = EdgeDistanceConfig[i].x * distance.x;
          edgeCell.position.y = EdgeDistanceConfig[i].y * distance.y;
          edgeCell.position.z = EdgeDistanceConfig[i].z * distance.z;

          edgeCell.position[edgeAxisConfig.axis] += j * GameplayConfig.grid.size + GameplayConfig.grid.size * 0.5 - edgeSize * 0.5 * GameplayConfig.grid.size;

          edgeCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

          edgeCells.push(edgeCell);
        }
      }
    }

    const edgeCellsInstanced = this.edgeCellsInstanced = InstancesHelper.createStaticInstancedMesh(edgeCells, material, geometry);
    this.add(edgeCellsInstanced);
  }

  private initSides(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.grid.size, GameplayConfig.grid.size, GameplayConfig.grid.size);
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });

    const sideCells: THREE.Object3D[] = [];

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
      const sizeX: number = this.levelConfig.size[cubeSideAxisConfig.xAxis];
      const sizeY: number = this.levelConfig.size[cubeSideAxisConfig.yAxis];

      for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
          if (CubeHelper.getCellTypeBySymbol(this.levelConfig.map.sides[cubeSide][i][j]) === CellType.Wall) {
            const sideCell = new THREE.Object3D();

            const distance: number = (this.levelConfig.size[cubeSideAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.grid.size;
            const offsetX: number = (this.levelConfig.size[cubeSideAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.grid.size;
            const offsetY: number = (this.levelConfig.size[cubeSideAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.grid.size;

            sideCell.position.x = SideVectorConfig[cubeSide].x * distance;
            sideCell.position.y = SideVectorConfig[cubeSide].y * distance;
            sideCell.position.z = SideVectorConfig[cubeSide].z * distance;

            sideCell.position[cubeSideAxisConfig.xAxis] += j * GameplayConfig.grid.size * cubeSideAxisConfig.xFactor - offsetX * cubeSideAxisConfig.xFactor;
            sideCell.position[cubeSideAxisConfig.yAxis] += i * GameplayConfig.grid.size * cubeSideAxisConfig.yFactor - offsetY * cubeSideAxisConfig.yFactor;

            sideCell.scale.set(GameplayConfig.grid.scale, GameplayConfig.grid.scale, GameplayConfig.grid.scale);

            sideCells.push(sideCell);
          }
        }
      }
    }

    const sideCellsInstanced = this.sideCellsInstanced = InstancesHelper.createStaticInstancedMesh(sideCells, material, geometry);
    this.add(sideCellsInstanced);
  }
}
