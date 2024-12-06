import * as THREE from 'three';
import { CubeSide } from '../../../Data/Enums/Cube/CubeSide';
import CubeHelper from '../../Helpers/CubeHelper';
import { CellType } from '../../../Data/Enums/Cube/CellType';
import { Direction } from '../../../Data/Enums/Direction';
import Materials from '../../../Core/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import ThreeJSHelper from '../../Helpers/ThreeJSHelper';
import { ICubePosition } from '../../../Data/Interfaces/ICubeConfig';
import { ILevelConfig } from '../../../Data/Interfaces/ILevelConfig';

export default class FinishLevelObject extends THREE.Group {
  private levelConfig: ILevelConfig;
  private cubeSide: CubeSide;
  private view: THREE.Mesh;

  constructor() {
    super();

    this.initView();
    this.hide();
  }

  public update(dt: number): void {
    this.view.rotation.z += dt;
    this.view.rotation.x += dt;
    this.view.rotation.y += dt;


    this.view.position.z = Math.sin(this.view.rotation.z * 2) * 0.1;
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
    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    const modelName: string = 'finish_object';
    const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

    const view: THREE.Mesh = this.view = new THREE.Mesh(geometry, material);
    this.add(view);

    view.castShadow = true;

    const light = new THREE.PointLight(0xff0000, 2, 100);
    light.position.set(0, 0, 0);
    this.add(light);

    light.castShadow = true;
    light.shadow.mapSize.width = 128;
    light.shadow.mapSize.height = 128;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 3;

    light.shadow.bias = -0.0001;
  }
}