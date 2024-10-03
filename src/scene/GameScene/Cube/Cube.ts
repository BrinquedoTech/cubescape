import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import GameplayConfig from '../../Configs/GameplayConfig';
import VertexConfig from '../../Configs/VertexConfig';
import { EdgeAxisConfig, EdgeDistanceConfig } from '../../Configs/EdgeConfig';
import { CubeSurfaceAxisConfig, SurfaceDistanceConfig } from '../../Configs/SurfaceConfig';
import { IEdgeAxisConfig, ICubeSurfaceAxisConfig } from '../../Interfaces/ICubeConfig';
import { RotateDirection, TurnDirection } from '../../Enums/RotateDirection';
import CubeRotationController from './CubeRotationController';
import { CubeSide } from '../../Enums/CubeSide';
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';

export default class Cube extends THREE.Group {
  private levelConfig: ILevelConfig;
  private cubeRotationController: CubeRotationController;

  constructor() {
    super();

    this.initCubeRotationController();
  }

  public update(dt: number): void {
    this.cubeRotationController.update(dt);
  }

  public rotateToDirection(rotateDirection: RotateDirection): void {
    this.cubeRotationController.rotateToDirection(rotateDirection);
  }

  public turn(turnDirection: TurnDirection): void {
    this.cubeRotationController.turn(turnDirection);
  }

  public getCurrentSide(): CubeSide {
    return this.cubeRotationController.getCurrentSide();
  }

  public getCurrentRotationDirection(): CubeRotationDirection {
    return this.cubeRotationController.getCurrentRotationDirection();
  }

  private initCubeRotationController(): void {
    this.cubeRotationController = new CubeRotationController(this);
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.removeCube();

    this.initInnerCube();
    this.initEdges();
    this.initSurfaces();
  }

  private removeCube(): void {

  }

  private initInnerCube(): void {
    const innerCubeSize: number = this.levelConfig.size * GameplayConfig.cellSize;

    const geometry = new THREE.BoxGeometry(innerCubeSize, innerCubeSize, innerCubeSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const innerCube = new THREE.Mesh(geometry, material);
    this.add(innerCube);
  }

  private initEdges(): void {
    this.initVertexCells();
    this.initEdgeCells();
  }

  private initVertexCells(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.cellSize, GameplayConfig.cellSize, GameplayConfig.cellSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff });

    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.cellSize;

    for (let i = 0; i < VertexConfig.length; i++) {
      const vertexCell = new THREE.Mesh(geometry, material);
      this.add(vertexCell);

      vertexCell.position.x = VertexConfig[i].x * distance;
      vertexCell.position.y = VertexConfig[i].y * distance;
      vertexCell.position.z = VertexConfig[i].z * distance;

      vertexCell.scale.set(GameplayConfig.cellScale, GameplayConfig.cellScale, GameplayConfig.cellScale);
    }
  }

  private initEdgeCells(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.cellSize, GameplayConfig.cellSize, GameplayConfig.cellSize);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });

    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.cellSize;

    for (let i = 0; i < EdgeAxisConfig.length; i++) {
      const edgeAxisConfig: IEdgeAxisConfig = EdgeAxisConfig[i];

      for (let j = 0; j < this.levelConfig.size; j++) {
        if (this.levelConfig.map.edges[edgeAxisConfig.edge][j] === 1) {
          const edgeCell = new THREE.Mesh(geometry, material);
          this.add(edgeCell);

          edgeCell.position.x = EdgeDistanceConfig[i].x * distance;
          edgeCell.position.y = EdgeDistanceConfig[i].y * distance;
          edgeCell.position.z = EdgeDistanceConfig[i].z * distance;

          edgeCell.position[edgeAxisConfig.axis] += j * GameplayConfig.cellSize + GameplayConfig.cellSize * 0.5 - this.levelConfig.size * 0.5 * GameplayConfig.cellSize;

          edgeCell.scale.set(GameplayConfig.cellScale, GameplayConfig.cellScale, GameplayConfig.cellScale);
        }
      }
    }
  }

  private initSurfaces(): void {
    const geometry = new THREE.BoxGeometry(GameplayConfig.cellSize, GameplayConfig.cellSize, GameplayConfig.cellSize);
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });

    const distance: number = (this.levelConfig.size + 1) * 0.5 * GameplayConfig.cellSize;
    const offset: number = ((this.levelConfig.size - 1) * GameplayConfig.cellSize) * 0.5;

    for (let k = 0; k < CubeSurfaceAxisConfig.length; k++) {
      const cubeSurfaceAxisConfig: ICubeSurfaceAxisConfig = CubeSurfaceAxisConfig[k];

      for (let i = 0; i < this.levelConfig.size; i++) {
        for (let j = 0; j < this.levelConfig.size; j++) {
          if (this.levelConfig.map.surfaces[cubeSurfaceAxisConfig.side][i][j] === 1) {
            const surfaceCell = new THREE.Mesh(geometry, material);
            this.add(surfaceCell);

            surfaceCell.position.x = SurfaceDistanceConfig[cubeSurfaceAxisConfig.configIndex].x * distance;
            surfaceCell.position.y = SurfaceDistanceConfig[cubeSurfaceAxisConfig.configIndex].y * distance;
            surfaceCell.position.z = SurfaceDistanceConfig[cubeSurfaceAxisConfig.configIndex].z * distance;

            surfaceCell.position[cubeSurfaceAxisConfig.xAxis] += j * GameplayConfig.cellSize * cubeSurfaceAxisConfig.xFactor - offset * cubeSurfaceAxisConfig.xFactor;
            surfaceCell.position[cubeSurfaceAxisConfig.yAxis] += i * GameplayConfig.cellSize * cubeSurfaceAxisConfig.yFactor - offset * cubeSurfaceAxisConfig.yFactor;

            surfaceCell.scale.set(GameplayConfig.cellScale, GameplayConfig.cellScale, GameplayConfig.cellScale);
          }
        }
      }
    }
  }
}
