import * as THREE from 'three';
import { CubeSide } from '../../Enums/CubeSide';
import GridHelper from '../../Helpers/GridHelper';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { ICubePosition } from '../../Interfaces/ICubeConfig';
import { CellType } from '../../Enums/CellType';
import { Text } from 'troika-three-text';
import { ObjectsRotationBySideConfig, SideVectorConfig } from '../../Configs/SideConfig';

export default class EndLevelObject extends THREE.Group {
  private levelConfig: ILevelConfig;

  constructor() {
    super();

    this.initView();
    this.hide();
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;
    const itemPositions: ICubePosition[] = GridHelper.getItemPositions(levelConfig.map.sides, CellType.Finish);

    if (itemPositions.length > 0) {
      const startPosition: ICubePosition = itemPositions[0];
      this.setPosition(startPosition.side, startPosition.gridPosition.x, startPosition.gridPosition.y);
      this.setRotation(startPosition.side);
      this.show();
    } else {
      console.warn('Finish position not found');
    }
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  private setPosition(cubeSide: CubeSide, gridX: number, gridY: number): void {
    const newPosition: THREE.Vector3 = GridHelper.getPositionByGridAndSide(this.levelConfig.size, cubeSide, gridX, gridY);
    this.position.set(newPosition.x, newPosition.y, newPosition.z);
  }

  private setRotation(cubeSide: CubeSide): void {
    const rotation: THREE.Euler = ObjectsRotationBySideConfig[cubeSide];
    this.rotation.set(rotation.x, rotation.y, rotation.z);
  }

  private initView(): void {
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