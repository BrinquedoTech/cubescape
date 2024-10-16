import * as THREE from 'three';
import { CubeSide } from '../../Enums/CubeSide';
import CubeHelper from '../../Helpers/CubeHelper';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { ICubePosition } from '../../Interfaces/ICubeConfig';
import { CellType } from '../../Enums/CellType';
import { Text } from 'troika-three-text';
import { Direction } from '../../Enums/Direction';

export default class EndLevelObject extends THREE.Group {
  private levelConfig: ILevelConfig;
  private cubeSide: CubeSide;

  constructor() {
    super();

    this.initView();
    this.hide();
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;
    const itemPositions: ICubePosition[] = CubeHelper.getItemPositions(levelConfig.map.sides, CellType.Finish);

    if (itemPositions.length > 0) {
      const startPosition: ICubePosition = itemPositions[0];
      this.cubeSide = startPosition.side;

      const newPosition: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, this.cubeSide, startPosition.gridPosition.x, startPosition.gridPosition.y);
      this.position.set(newPosition.x, newPosition.y, newPosition.z);

      CubeHelper.setSideRotation(this, this.cubeSide);
      CubeHelper.setRotationByDirection(this, this.cubeSide, Direction.Right);
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