import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import GameplayConfig from '../../Configs/GameplayConfig';
import VertexConfig from '../../Configs/VertexConfig';
import { EdgeAxisConfig, EdgeDistanceConfig } from '../../Configs/EdgeConfig';
import { CubeSurfaceAxisConfig, SideVectorConfig } from '../../Configs/SurfaceConfig';
import { IEdgeAxisConfig, ICubeSurfaceAxisConfig } from '../../Interfaces/ICubeConfig';
import { RotateDirection, TurnDirection } from '../../Enums/RotateDirection';
import CubeRotationController from './CubeRotationController';
import { CubeSide } from '../../Enums/CubeSide';
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';
import { CubeState } from '../../Enums/CubeState';
import CubeDebug from './CubeDebug';
import mitt, { Emitter } from 'mitt';
import { DefaultStartSideConfig } from '../../Configs/StartSideConfig';

type Events = {
  endRotating: string;
};

export default class Cube extends THREE.Group {
  private levelConfig: ILevelConfig;
  private cubeRotationController: CubeRotationController;
  private cubeDebug: CubeDebug;
  private state: CubeState = CubeState.Idle;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.initCubeRotationController();
    this.initCubeDebug();
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

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.removeCube();

    this.initInnerCube();
    this.initEdges();
    this.initSurfaces();
    this.setStartSide();
    
    this.cubeDebug.setLevelConfig(levelConfig);
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

  private removeCube(): void {

  }

  private initInnerCube(): void {
    const innerCubeSize = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.gridSize,
      this.levelConfig.size.y * GameplayConfig.gridSize,
      this.levelConfig.size.z * GameplayConfig.gridSize,
    );

    const geometry = new THREE.BoxGeometry(innerCubeSize.x, innerCubeSize.y, innerCubeSize.z);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const innerCube = new THREE.Mesh(geometry, material);
    this.add(innerCube);
  }

  private initEdges(): void {
    this.initVertexCells();
    this.initEdgeCells();
  }

  private initVertexCells(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.gridSize, GameplayConfig.gridSize, GameplayConfig.gridSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });

    const distance = new THREE.Vector3(
      (this.levelConfig.size.x + 1) * 0.5 * GameplayConfig.gridSize,
      (this.levelConfig.size.y + 1) * 0.5 * GameplayConfig.gridSize,
      (this.levelConfig.size.z + 1) * 0.5 * GameplayConfig.gridSize,
    );

    for (let i = 0; i < VertexConfig.length; i++) {
      const vertexCell = new THREE.Mesh(geometry, material);
      this.add(vertexCell);

      vertexCell.position.x = VertexConfig[i].x * distance.x;
      vertexCell.position.y = VertexConfig[i].y * distance.y;
      vertexCell.position.z = VertexConfig[i].z * distance.z;

      vertexCell.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
    }
  }

  private initEdgeCells(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.gridSize, GameplayConfig.gridSize, GameplayConfig.gridSize);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });

    const distance = new THREE.Vector3(
      (this.levelConfig.size.x + 1) * 0.5 * GameplayConfig.gridSize,
      (this.levelConfig.size.y + 1) * 0.5 * GameplayConfig.gridSize,
      (this.levelConfig.size.z + 1) * 0.5 * GameplayConfig.gridSize,
    );

    for (let i = 0; i < EdgeAxisConfig.length; i++) {
      const edgeAxisConfig: IEdgeAxisConfig = EdgeAxisConfig[i];
      const edgeSize: number = this.levelConfig.size[edgeAxisConfig.axis];
      
      for (let j = 0; j < edgeSize; j++) {
        if (this.levelConfig.map.edges[edgeAxisConfig.edge][j] === 1) {
          const edgeCell = new THREE.Mesh(geometry, material);
          this.add(edgeCell);

          edgeCell.position.x = EdgeDistanceConfig[i].x * distance.x;
          edgeCell.position.y = EdgeDistanceConfig[i].y * distance.y;
          edgeCell.position.z = EdgeDistanceConfig[i].z * distance.z;

          edgeCell.position[edgeAxisConfig.axis] += j * GameplayConfig.gridSize + GameplayConfig.gridSize * 0.5 - edgeSize * 0.5 * GameplayConfig.gridSize;

          edgeCell.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
        }
      }
    }
  }

  private initSurfaces(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.gridSize, GameplayConfig.gridSize, GameplayConfig.gridSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const cubeSurfaceAxisConfig: ICubeSurfaceAxisConfig = CubeSurfaceAxisConfig[cubeSide];
      const sizeX: number = this.levelConfig.size[cubeSurfaceAxisConfig.xAxis];
      const sizeY: number = this.levelConfig.size[cubeSurfaceAxisConfig.yAxis];

      for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
          if (this.levelConfig.map.surfaces[cubeSide][i][j] === 1) {
            const surfaceCell = new THREE.Mesh(geometry, material);
            this.add(surfaceCell);

            const distance: number = (this.levelConfig.size[cubeSurfaceAxisConfig.zAxis] + 1) * 0.5 * GameplayConfig.gridSize;
            const offsetX: number = (this.levelConfig.size[cubeSurfaceAxisConfig.xAxis] - 1) * 0.5 * GameplayConfig.gridSize;
            const offsetY: number = (this.levelConfig.size[cubeSurfaceAxisConfig.yAxis] - 1) * 0.5 * GameplayConfig.gridSize;

            surfaceCell.position.x = SideVectorConfig[cubeSide].x * distance;
            surfaceCell.position.y = SideVectorConfig[cubeSide].y * distance;
            surfaceCell.position.z = SideVectorConfig[cubeSide].z * distance;

            surfaceCell.position[cubeSurfaceAxisConfig.xAxis] += j * GameplayConfig.gridSize * cubeSurfaceAxisConfig.xFactor - offsetX * cubeSurfaceAxisConfig.xFactor;
            surfaceCell.position[cubeSurfaceAxisConfig.yAxis] += i * GameplayConfig.gridSize * cubeSurfaceAxisConfig.yFactor - offsetY * cubeSurfaceAxisConfig.yFactor;

            surfaceCell.scale.set(GameplayConfig.gridScale, GameplayConfig.gridScale, GameplayConfig.gridScale);
          }
        }
      }
    }
  }
}
