import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import GameplayConfig from '../../Configs/GameplayConfig';
import VertexConfig from '../../Configs/VertexConfig';
import { EdgeAxisConfig, EdgeDistanceConfig } from '../../Configs/EdgeConfig';
import { CubeSurfaceAxisConfig, SurfaceDistanceConfig } from '../../Configs/SurfaceConfig';
import { IEdgeAxisConfig, ICubeSurfaceAxisConfig } from '../../Interfaces/ICubeConfig';
import { RotateDirection } from '../../Enums/RotateDirection';

export default class Cube extends THREE.Group {
  private levelConfig: ILevelConfig;
  private rotationDirection: RotateDirection;
  private rotationProgress: number = 0;
  private rotationSpeed: number = 2;
  private isRotating: boolean;

  constructor() {
    super();
  }

  public update(dt: number): void {
    if (this.isRotating) {
      this.rotationProgress += dt * this.rotationSpeed;

      if (this.rotationProgress >= 1) {
        this.isRotating = false;
        this.rotationProgress = 0;
        this.rotationDirection = null;

        this.rotation.x = Math.round(this.rotation.x / (Math.PI * 0.5)) * Math.PI * 0.5;
        this.rotation.y = Math.round(this.rotation.y / (Math.PI * 0.5)) * Math.PI * 0.5;
        this.rotation.z = Math.round(this.rotation.z / (Math.PI * 0.5)) * Math.PI * 0.5;        
      }

      switch (this.rotationDirection) {
        case RotateDirection.Right:
          this.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -Math.PI * 0.5 * dt * this.rotationSpeed);
          break;
        case RotateDirection.Left:
          this.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI * 0.5 * dt * this.rotationSpeed);
          break;
        case RotateDirection.Up:
          this.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), Math.PI * 0.5 * dt * this.rotationSpeed);
          break;
        case RotateDirection.Down:
          this.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -Math.PI * 0.5 * dt * this.rotationSpeed);
          break
      }
    }
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.removeCube();

    this.initInnerCube();
    this.initEdges();
    this.initSurfaces();
  }

  public rotateToDirection(rotateDirection: RotateDirection): void {
    if (this.isRotating) {
      return;
    }

    this.isRotating = true;
    this.rotationDirection = rotateDirection;
  }

  // public rotateClockwise(): void {

  // }

  // public rotateCounterClockwise(): void {

  // }

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
