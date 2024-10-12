import * as THREE from 'three';
import { CubeSide } from '../../Enums/CubeSide';
import GridHelper from '../../Helpers/GridHelper';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { ICubePosition } from '../../Interfaces/ICubeConfig';
import { CellType } from '../../Enums/CellType';
import { Text } from 'troika-three-text';

export default class EndLevelObject extends THREE.Group {
  private levelConfig: ILevelConfig;

  constructor() {
    super();

    this.init();
  }

  public initPosition(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;
    const itemPositions: ICubePosition[] = GridHelper.getItemPositions(levelConfig.map.surfaces, CellType.Finish);

    if (itemPositions.length > 0) {
      const startPosition: ICubePosition = itemPositions[0];
      this.setPosition(startPosition.side, startPosition.gridPosition.x, startPosition.gridPosition.y);
    }
  }

  private setPosition(cubeSide: CubeSide, gridX: number, gridY: number): void {
    const newPosition: THREE.Vector3 = GridHelper.getPositionByGridAndSide(this.levelConfig.size, cubeSide, gridX, gridY);
    this.position.set(newPosition.x, newPosition.y, newPosition.z);
  }

  private init(): void {
    const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000aa,
      opacity: 0.5,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.add(mesh);

    const finishText = new Text();
    finishText.text = 'Finish';
    finishText.fontSize = 0.28;
    finishText.anchorX = 'center';
    finishText.anchorY = 'middle';
    finishText.color = 0xffffff;
    this.add(finishText);

    finishText.position.set(0, 0, 0.45 + 0.01);
  }
}