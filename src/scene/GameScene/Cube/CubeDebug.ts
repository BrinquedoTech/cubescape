import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CubeSide } from '../../Enums/CubeSide';
import { SurfaceRotationConfig, SideVectorConfig, CubeSurfaceAxisConfig } from '../../Configs/SurfaceConfig';
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';
import { CubeEdgeName, CubeEdgeNameVectorsConfig, CubeSideName, GridRotationConfig } from '../../Configs/VisualDebugConfig';

export default class CubeDebug extends THREE.Group {
  private levelConfig: ILevelConfig;
  private grids: THREE.LineSegments[] = [];
  private textOffset: number = 0.01;

  constructor() {
    super();

  }

  public setLevelConfig(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.removeAll();
    this.init();
  }

  private removeAll(): void {

  }

  private init(): void {
    this.initGrids();
    this.initTexts();
  }

  private initGrids(): void {
    const size = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.gridSize,
      this.levelConfig.size.y * GameplayConfig.gridSize,
      this.levelConfig.size.z * GameplayConfig.gridSize,
    );

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const rotation: THREE.Vector3 = GridRotationConfig[cubeSide];
      const sizeForSide: number = size[CubeSurfaceAxisConfig[cubeSide].zAxis];
      const position: THREE.Vector3 = SideVectorConfig[cubeSide].clone().multiplyScalar(sizeForSide * 0.5 + GameplayConfig.gridSize + this.textOffset);

      const sizeA: number = size[CubeSurfaceAxisConfig[cubeSide].xAxis];
      const sizeB: number = size[CubeSurfaceAxisConfig[cubeSide].yAxis];
      const segmentsX: number = this.levelConfig.size[CubeSurfaceAxisConfig[cubeSide].xAxis];
      const segmentsY: number = this.levelConfig.size[CubeSurfaceAxisConfig[cubeSide].yAxis];
      const grid = this.createGrid(sizeA, sizeB, segmentsX, segmentsY);
      this.add(grid);

      grid.rotation.set(rotation.x, rotation.y, rotation.z);
      grid.position.set(position.x, position.y, position.z);

      this.grids.push(grid);
    }
  }

  private createGrid(xSize: number, ySize: number, xSegments: number, ySegments: number): THREE.LineSegments {
    const geometry = new THREE.BufferGeometry();
    const vertices: number[] = [];

    const halfXSize: number = xSize * 0.5;
    const halfYSize: number = ySize * 0.5;

    for (let i = 0; i <= xSegments; i++) {
      const x = (i / xSegments) * xSize - halfXSize;
      vertices.push(x, -halfYSize, 0);
      vertices.push(x, halfYSize, 0);
    }

    for (let j = 0; j <= ySegments; j++) {
      const y = (j / ySegments) * ySize - halfYSize;
      vertices.push(-halfXSize, y, 0);
      vertices.push(halfXSize, y, 0);
    }

    const vertexBuffer = new Float32Array(vertices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertexBuffer, 3));

    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const grid = new THREE.LineSegments(geometry, material);

    return grid;
  }

  private initTexts(): void {
    this.initCubeSideName();
    this.initCubeEdgeName();
  }

  private initCubeSideName(): void {
    const textAxis: { [key in CubeSide]: string } = {
      [CubeSide.Front]: 'y',
      [CubeSide.Back]: 'y',
      [CubeSide.Left]: 'y',
      [CubeSide.Right]: 'y',
      [CubeSide.Top]: 'z',
      [CubeSide.Bottom]: 'z',
    };

    const size = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.gridSize,
      this.levelConfig.size.y * GameplayConfig.gridSize,
      this.levelConfig.size.z * GameplayConfig.gridSize,
    );

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const rotation: THREE.Vector3 = SurfaceRotationConfig[cubeSide];
      const sizeForSide: number = size[CubeSurfaceAxisConfig[cubeSide].zAxis];
      const position: THREE.Vector3 = SideVectorConfig[cubeSide].clone().multiplyScalar(sizeForSide * 0.5 + GameplayConfig.gridSize + this.textOffset);

      const cubeSideText: Text = this.createText(CubeSideName[cubeSide], 0.6);
      this.add(cubeSideText);
      cubeSideText.position.set(position.x, position.y, position.z);
      cubeSideText.rotation.set(rotation.x, rotation.y, rotation.z);

      const textSideOffset = size[textAxis[cubeSide]];
      const offsetUp = new THREE.Vector3(0, textSideOffset * 0.5 + GameplayConfig.gridSize * 0.7, 0);
      const upPosition: THREE.Vector3 = offsetUp.clone().applyEuler(cubeSideText.rotation);
      cubeSideText.position.add(upPosition);
    }
  }

  private initCubeEdgeName(): void {
    const size = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.gridSize,
      this.levelConfig.size.y * GameplayConfig.gridSize,
      this.levelConfig.size.z * GameplayConfig.gridSize,
    );

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const rotation: THREE.Vector3 = SurfaceRotationConfig[cubeSide];
      const sizeForSide: number = size[CubeSurfaceAxisConfig[cubeSide].zAxis];
      const position: THREE.Vector3 = SideVectorConfig[cubeSide].clone().multiplyScalar(sizeForSide * 0.5 + GameplayConfig.gridSize + this.textOffset);
      const surfaceGroup = new THREE.Group();
      this.add(surfaceGroup);
      surfaceGroup.position.copy(position);
      surfaceGroup.rotation.set(rotation.x, rotation.y, rotation.z);

      for (const edge in CubeRotationDirection) {
        const cubeRotationDirection: CubeRotationDirection = CubeRotationDirection[edge];
        const cubeSideText: Text = this.createText(CubeEdgeName[cubeRotationDirection], 0.3);
        surfaceGroup.add(cubeSideText);

        const isTopOrBottom: boolean = cubeRotationDirection === CubeRotationDirection.Top || cubeRotationDirection === CubeRotationDirection.Bottom;
        const offsetAxis: string = isTopOrBottom ? CubeSurfaceAxisConfig[cubeSide].yAxis : CubeSurfaceAxisConfig[cubeSide].xAxis;
        const textSideOffset: number = size[offsetAxis];
        const edgePosition = CubeEdgeNameVectorsConfig[cubeRotationDirection].position.clone().multiplyScalar(textSideOffset * 0.5 + GameplayConfig.gridSize * 0.2);
        cubeSideText.position.copy(edgePosition);

        const edgeRotation = CubeEdgeNameVectorsConfig[cubeRotationDirection].rotation;
        cubeSideText.rotation.set(edgeRotation.x, edgeRotation.y, edgeRotation.z);
      }
    }
  }

  private createText(textString: string, fontSize?: number, color?: number): Text {
    const text = new Text();
    text.text = textString;
    text.fontSize = fontSize || 0.7;
    text.anchorX = 'center';
    text.anchorY = 'middle';
    text.color = color || 0xffffff;

    return text;
  }
}