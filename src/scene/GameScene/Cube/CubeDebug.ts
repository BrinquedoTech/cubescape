import * as THREE from 'three';
import { Text } from 'troika-three-text';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import GameplayConfig from '../../Configs/GameplayConfig';
import { CubeSide } from '../../Enums/CubeSide';
import { SurfaceRotationConfig, SurfaceVectorConfig } from '../../Configs/SurfaceConfig';
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';
import { CubeEdgeName, CubeEdgeNameVectorsConfig, CubeSideName } from '../../Configs/DebugTextConfig';

export default class CubeDebug extends THREE.Group {
  private levelConfig: ILevelConfig;
  private grids: THREE.GridHelper[] = [];
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
    this.initGrid();
    this.initTexts();
  }

  private initGrid(): void {
    const gridRotationConfig: { [key in CubeSide]: THREE.Vector3 } = {
      [CubeSide.Front]: new THREE.Vector3(Math.PI * 0.5, 0, 0),
      [CubeSide.Back]: new THREE.Vector3(Math.PI * 0.5, Math.PI, 0),
      [CubeSide.Left]: new THREE.Vector3(0, 0, Math.PI * 0.5),
      [CubeSide.Right]: new THREE.Vector3(0, 0, -Math.PI * 0.5),
      [CubeSide.Top]: new THREE.Vector3(0, 0, 0),
      [CubeSide.Bottom]: new THREE.Vector3(Math.PI, 0, 0),
    };

    const size: number = this.levelConfig.size * GameplayConfig.cellSize;

    for (const side in CubeSide) {
      const rotation: THREE.Vector3 = gridRotationConfig[CubeSide[side]];
      const position: THREE.Vector3 = SurfaceVectorConfig[CubeSide[side]].clone().multiplyScalar(size * 0.5 + GameplayConfig.cellSize + this.textOffset);

      const grid = new THREE.GridHelper(size, this.levelConfig.size, 0x0000ff, 0x808080);
      this.add(grid);
      grid.rotation.set(rotation.x, rotation.y, rotation.z);
      grid.position.set(position.x, position.y, position.z);

      this.grids.push(grid);
    }
  }

  private initTexts(): void {
    this.initCubeSideName();
    this.initCubeEdgeName();
  }

  private initCubeSideName(): void {
    const offsetUp = new THREE.Vector3(0, this.levelConfig.size * GameplayConfig.cellSize * 0.5 + GameplayConfig.cellSize * 0.7, 0);
  
    for (const side in CubeSide) {
      const rotation: THREE.Vector3 = SurfaceRotationConfig[CubeSide[side]];
      const position: THREE.Vector3 = SurfaceVectorConfig[CubeSide[side]].clone().multiplyScalar(this.levelConfig.size * GameplayConfig.cellSize * 0.5 + GameplayConfig.cellSize + this.textOffset);
  
      const cubeSideText: Text = this.createText(CubeSideName[CubeSide[side]], 0.6);
      this.add(cubeSideText);
      cubeSideText.position.copy(position);
      cubeSideText.rotation.set(rotation.x, rotation.y, rotation.z);

      const upPosition: THREE.Vector3 = offsetUp.clone().applyEuler(cubeSideText.rotation);
      cubeSideText.position.add(upPosition);
    }
  }

  private initCubeEdgeName(): void {
    for (const side in CubeSide) {
      const rotation: THREE.Vector3 = SurfaceRotationConfig[CubeSide[side]];
      const position: THREE.Vector3 = SurfaceVectorConfig[CubeSide[side]].clone().multiplyScalar(this.levelConfig.size * GameplayConfig.cellSize * 0.5 + GameplayConfig.cellSize + this.textOffset);
      const surfaceGroup = new THREE.Group();
      this.add(surfaceGroup);
      surfaceGroup.position.copy(position);
      surfaceGroup.rotation.set(rotation.x, rotation.y, rotation.z);
  
      for (const edge in CubeRotationDirection) {
        const cubeSideText: Text = this.createText(CubeEdgeName[CubeRotationDirection[edge]], 0.3);
        surfaceGroup.add(cubeSideText);
        
        const edgePosition = CubeEdgeNameVectorsConfig[CubeRotationDirection[edge]].position.clone().multiplyScalar(this.levelConfig.size * GameplayConfig.cellSize * 0.5 + GameplayConfig.cellSize * 0.2);
        cubeSideText.position.copy(edgePosition);

        const edgeRotation = CubeEdgeNameVectorsConfig[CubeRotationDirection[edge]].rotation;
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