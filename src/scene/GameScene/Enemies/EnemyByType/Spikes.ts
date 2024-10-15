import * as THREE from 'three';
import { ISpikeConfig } from '../../../Interfaces/IEnemyConfig';
import GridHelper from '../../../Helpers/GridHelper';
import { CubeSide } from '../../../Enums/CubeSide';
import { ILevelConfig } from '../../../Interfaces/ILevelConfig';
import InstancesHelper from '../../../Helpers/InstancesHelper';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export default class Spikes extends THREE.Group {
  private configs: ISpikeConfig[];
  private levelConfig: ILevelConfig;
  private spikesInstanced: THREE.InstancedMesh;

  constructor(configs: ISpikeConfig[]) {
    super();

    this.configs = configs;
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    const spikeObjects: THREE.Object3D[] = [];

    const geometry: THREE.BufferGeometry = this.createSpikeGeometry();
    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    for (let i = 0; i < this.configs.length; i++) {
      const config: ISpikeConfig = this.configs[i];
      const sidePosition: THREE.Vector2 = config.position;
      const side: CubeSide = config.side;

      const spike: THREE.Object3D = new THREE.Object3D();

      const position: THREE.Vector3 = GridHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);
      spike.position.copy(position);

      spikeObjects.push(spike);
    }

    const spikesInstanced = this.spikesInstanced = InstancesHelper.createStaticInstancedMesh(spikeObjects, material, geometry);
    this.add(spikesInstanced);
  }

  public kill(): void {
    ThreeJSHelper.killInstancedMesh(this.spikesInstanced, this);
  }

  private createSpikeGeometry(): THREE.BufferGeometry {
    const width = 0.8;
    const spikeHeight = 1 - width;
    const spikeOffset = 0.3;

    const baseGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(width, 1, 1);
    baseGeometry.translate(-(1 - width) * 0.5, 0, 0);
    const coneGeometry = new THREE.ConeGeometry(spikeHeight * 0.5, spikeHeight, 32);

    const object: THREE.Object3D = new THREE.Object3D();
    const positions: THREE.Vector3[] = [
      new THREE.Vector3(0.5 - spikeHeight * 0.5, 0, 0),
      new THREE.Vector3(0.5 - spikeHeight * 0.5, spikeOffset, spikeOffset),
      new THREE.Vector3(0.5 - spikeHeight * 0.5, -spikeOffset, spikeOffset),
      new THREE.Vector3(0.5 - spikeHeight * 0.5, spikeOffset, -spikeOffset),
      new THREE.Vector3(0.5 - spikeHeight * 0.5, -spikeOffset, -spikeOffset),
    ];

    const coneGeometries: THREE.BufferGeometry[] = [];

    for (let i = 0; i < positions.length; i++) {
      object.position.copy(positions[i]);
      object.rotation.set(0, 0, -Math.PI / 2);
      object.updateMatrix();

      const coneGeometryClone = coneGeometry.clone().applyMatrix4(object.matrix);
      coneGeometries.push(coneGeometryClone);
    }

    return BufferGeometryUtils.mergeGeometries([baseGeometry, ...coneGeometries]);;
  }
}
