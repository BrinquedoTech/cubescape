import * as THREE from 'three';
import { Text } from 'troika-three-text';
import GameplayConfig from '../../../Data/Configs/GameplayConfig';
import { CubeSide } from '../../../Data/Enums/Cube/CubeSide';
import { SideRotationConfig, SideVectorConfig, CubeSideAxisConfig } from '../../../Data/Configs/Cube/SideConfig';
import { CubeRotationDirection } from '../../../Data/Enums/Cube/CubeRotationDirection';
import { CubeEdgeName, CubeEdgeNameVectorsConfig, CubeSideName, GridRotationConfig, TextAxisOnCubeSide } from '../../../Data/Configs/Debug/VisualDebugConfig';
import DebugConfig from '../../../Data/Configs/Debug/DebugConfig';
import { ILevelConfig } from '../../../Data/Interfaces/ILevelConfig';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';

export default class CubeDebug extends THREE.Group {
  private levelConfig: ILevelConfig;
  private textOffset: number = 0.02;
  private textGridOffset: number = 0.01;

  private grids: THREE.LineSegments[] = [];
  private cubeSideTexts: Text[] = [];
  private cubeEdgeTexts: Text[][] = [];
  private cubeEdgeNameSideGroup: THREE.Group[] = [];
  private cubeGridCoordinatesPlanes: THREE.Mesh[] = [];

  constructor() {
    super();

  }

  public setLevelConfig(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.init();
  }

  public removeDebug(): void {
    ThreeJSHelper.killObjects(this.grids, this);
    ThreeJSHelper.killObjects(this.cubeSideTexts, this);
    ThreeJSHelper.killObjects(this.cubeGridCoordinatesPlanes, this);

    this.cubeEdgeTexts.forEach((cubeEdgeTexts: Text[]) => {
      ThreeJSHelper.killObjects(cubeEdgeTexts);
    });

    this.cubeEdgeNameSideGroup.forEach((cubeEdgeNameSideGroup: THREE.Group) => {
      this.remove(cubeEdgeNameSideGroup);
    });

    this.grids = [];
    this.cubeSideTexts = [];
    this.cubeEdgeTexts = [];
    this.cubeEdgeNameSideGroup = [];
    this.cubeGridCoordinatesPlanes = [];
  }

  private init(): void {
    this.initGrids();
    this.initTexts();
  }

  private initGrids(): void {
    if (!DebugConfig.gameplay.grid) {
      return;
    }

    const size = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.grid.size,
      this.levelConfig.size.y * GameplayConfig.grid.size,
      this.levelConfig.size.z * GameplayConfig.grid.size,
    );

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const rotation: THREE.Vector3 = GridRotationConfig[cubeSide];
      const sizeForSide: number = size[CubeSideAxisConfig[cubeSide].zAxis];
      const position: THREE.Vector3 = SideVectorConfig[cubeSide].clone().multiplyScalar(sizeForSide * 0.5 + GameplayConfig.grid.size + this.textOffset);

      const sizeA: number = size[CubeSideAxisConfig[cubeSide].xAxis];
      const sizeB: number = size[CubeSideAxisConfig[cubeSide].yAxis];
      const segmentsX: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].xAxis];
      const segmentsY: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].yAxis];
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
    this.initCubeGridCoordinates();
  }

  private initCubeSideName(): void {
    if (!DebugConfig.gameplay.cubeSideName) {
      return;
    }

    const size = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.grid.size,
      this.levelConfig.size.y * GameplayConfig.grid.size,
      this.levelConfig.size.z * GameplayConfig.grid.size,
    );

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const rotation: THREE.Vector3 = SideRotationConfig[cubeSide];
      const sizeForSide: number = size[CubeSideAxisConfig[cubeSide].zAxis];
      const position: THREE.Vector3 = SideVectorConfig[cubeSide].clone().multiplyScalar(sizeForSide * 0.5 + GameplayConfig.grid.size + this.textOffset);

      const cubeSideText: Text = this.createText(CubeSideName[cubeSide], 0.6);
      this.add(cubeSideText);
      cubeSideText.position.set(position.x, position.y, position.z);
      cubeSideText.rotation.set(rotation.x, rotation.y, rotation.z);

      const textSideOffset = size[TextAxisOnCubeSide[cubeSide]];
      const offsetUp = new THREE.Vector3(0, textSideOffset * 0.5 + GameplayConfig.grid.size * 0.7, 0);
      const upPosition: THREE.Vector3 = offsetUp.clone().applyEuler(cubeSideText.rotation);
      cubeSideText.position.add(upPosition);

      this.cubeSideTexts.push(cubeSideText);
    }
  }

  private initCubeEdgeName(): void {
    if (!DebugConfig.gameplay.cubeRotationName) {
      return;
    }

    const size = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.grid.size,
      this.levelConfig.size.y * GameplayConfig.grid.size,
      this.levelConfig.size.z * GameplayConfig.grid.size,
    );

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const rotation: THREE.Vector3 = SideRotationConfig[cubeSide];
      const sizeForSide: number = size[CubeSideAxisConfig[cubeSide].zAxis];
      const position: THREE.Vector3 = SideVectorConfig[cubeSide].clone().multiplyScalar(sizeForSide * 0.5 + GameplayConfig.grid.size + this.textOffset);
      const cubeEdgeNameSideGroup = new THREE.Group();
      this.add(cubeEdgeNameSideGroup);
      this.cubeEdgeNameSideGroup.push(cubeEdgeNameSideGroup);

      cubeEdgeNameSideGroup.position.copy(position);
      cubeEdgeNameSideGroup.rotation.set(rotation.x, rotation.y, rotation.z);

      this.cubeEdgeTexts.push([]);

      for (const edge in CubeRotationDirection) {
        const cubeRotationDirection: CubeRotationDirection = CubeRotationDirection[edge];
        const cubeSideText: Text = this.createText(CubeEdgeName[cubeRotationDirection], 0.3);
        cubeEdgeNameSideGroup.add(cubeSideText);

        const isTopOrBottom: boolean = cubeRotationDirection === CubeRotationDirection.Top || cubeRotationDirection === CubeRotationDirection.Bottom;
        const offsetAxis: string = isTopOrBottom ? CubeSideAxisConfig[cubeSide].yAxis : CubeSideAxisConfig[cubeSide].xAxis;
        const textSideOffset: number = size[offsetAxis];
        const edgePosition = CubeEdgeNameVectorsConfig[cubeRotationDirection].position.clone().multiplyScalar(textSideOffset * 0.5 + GameplayConfig.grid.size * 0.2);
        cubeSideText.position.copy(edgePosition);

        const edgeRotation = CubeEdgeNameVectorsConfig[cubeRotationDirection].rotation;
        cubeSideText.rotation.set(edgeRotation.x, edgeRotation.y, edgeRotation.z);

        this.cubeEdgeTexts[this.cubeEdgeTexts.length - 1].push(cubeSideText);
      }
    }
  }

  private initCubeGridCoordinates(): void {
    if (!DebugConfig.gameplay.gridCoordinates) {
      return;
    }

    const size = new THREE.Vector3(
      this.levelConfig.size.x * GameplayConfig.grid.size,
      this.levelConfig.size.y * GameplayConfig.grid.size,
      this.levelConfig.size.z * GameplayConfig.grid.size,
    );

    for (const side in CubeSide) {
      const cubeSide: CubeSide = CubeSide[side];
      const rotation: THREE.Vector3 = SideRotationConfig[cubeSide];
      const sizeForSide: number = size[CubeSideAxisConfig[cubeSide].zAxis];
      const position: THREE.Vector3 = SideVectorConfig[cubeSide].clone().multiplyScalar(sizeForSide * 0.5 + GameplayConfig.grid.size + this.textGridOffset);
      const sizeX: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].xAxis];
      const sizeY: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].yAxis];
      
      const planeGeometry = new THREE.PlaneGeometry(sizeX * GameplayConfig.grid.size, sizeY * GameplayConfig.grid.size);
      const texture: THREE.CanvasTexture = this.createGridTexture(sizeX, sizeY);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      });
  
      const gridCoordinatesPlane = new THREE.Mesh(planeGeometry, material);
      this.add(gridCoordinatesPlane);

      gridCoordinatesPlane.position.copy(position);
      gridCoordinatesPlane.rotation.set(rotation.x, rotation.y, rotation.z);

      const offsetUp = new THREE.Vector3(0, -GameplayConfig.grid.size * 0.3, 0);
      const upPosition: THREE.Vector3 = offsetUp.clone().applyEuler(gridCoordinatesPlane.rotation);
      gridCoordinatesPlane.position.add(upPosition);

      this.cubeGridCoordinatesPlanes.push(gridCoordinatesPlane);
    }
  }

  private createGridTexture(gridSizeX: number, gridSizeY: number): THREE.CanvasTexture {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    const resolution: number = 100;
    const color: string = '#ffffff';

    canvas.width = gridSizeX * resolution;
    canvas.height = gridSizeY * resolution;

    ctx.fillStyle = color;
    ctx.font = `20px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let x = 0; x < gridSizeX; x++) {
      for (let y = 0; y < gridSizeY; y++) {
        const text = `${x}:${y}`;
        const resultX: number = (x + 0.5) * resolution;
        const resultY: number = (y + 0.5) * resolution;
        ctx.fillText(text, resultX, resultY);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
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
