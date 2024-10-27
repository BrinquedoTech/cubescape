import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import { IWallSpikeConfig as IFloorSpikeConfig } from '../../../Interfaces/IEnemyConfig';
import { ILevelConfig } from '../../../Interfaces/ILevelConfig';
import Materials from '../../../../core/Materials';
import { MaterialType } from '../../../Enums/MaterialType';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { CubeSide } from '../../../Enums/CubeSide';
import CubeHelper from '../../../Helpers/CubeHelper';
import InstancesHelper from '../../../Helpers/InstancesHelper';
import { FloorSpikesGeneralConfig } from '../../../Configs/Enemies/FloorSpikesConfig';
import { IFloorSpikeInstanceConfig } from '../../../Interfaces/IFloorSpikesConfig';

export default class FloorSpikes extends THREE.Group {
  private configs: IFloorSpikeConfig[];
  private levelConfig: ILevelConfig;
  private spikeInstanceConfig: IFloorSpikeInstanceConfig[] = [];
  private floorSpikesInstanced: THREE.InstancedMesh;
  private floorSpikesBaseInstanced: THREE.InstancedMesh;

  constructor(configs: IFloorSpikeConfig[]) {
    super();

    this.configs = configs;
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

    const geometryBase: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('floor_spikes_base');
    ThreeJSHelper.setGeometryRotation(geometryBase, FloorSpikesGeneralConfig.geometryBaseRotation);

    const geometrySpikes: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('floor_spikes');
    ThreeJSHelper.setGeometryRotation(geometrySpikes, FloorSpikesGeneralConfig.geometrySpikeRotation);

    const floorSpikeObjects: THREE.Object3D[] = [];

    for (let i = 0; i < this.configs.length; i++) {
      const config: IFloorSpikeConfig = this.configs[i];
      const sidePosition: THREE.Vector2 = config.position;
      const side: CubeSide = config.side;

      const floorSpike: THREE.Object3D = new THREE.Object3D();

      const position: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);

      floorSpike.position.copy(position);
      CubeHelper.setSideRotation(floorSpike, side);

      floorSpikeObjects.push(floorSpike);
      this.spikeInstanceConfig.push({ mapConfig: config, instanceId: i, isActive: false, startPosition: position });
    }

    const floorSpikesBaseInstanced = this.floorSpikesBaseInstanced = InstancesHelper.createStaticInstancedMesh(floorSpikeObjects, material, geometryBase);
    this.add(floorSpikesBaseInstanced);

    floorSpikesBaseInstanced.receiveShadow = true;

    const floorSpikesInstanced = this.floorSpikesInstanced = InstancesHelper.createStaticInstancedMesh(floorSpikeObjects, material, geometrySpikes);
    this.add(floorSpikesInstanced);

    floorSpikesInstanced.instanceMatrix.usage = THREE.DynamicDrawUsage;
    floorSpikesInstanced.receiveShadow = true;
    floorSpikesInstanced.castShadow = true;

    setTimeout(() => {
      this.activateSpikes(4);
    }, 1000);

    setTimeout(() => {
      this.deactivateSpikes(4);
    }, 2000);
  }

  public kill(): void {
    ThreeJSHelper.killInstancedMesh(this.floorSpikesInstanced, this);
    ThreeJSHelper.killInstancedMesh(this.floorSpikesBaseInstanced, this);
  }

  private activateSpikes(id: number): void {
    const instanceConfig: IFloorSpikeInstanceConfig = this.getConfigById(id);

    if (instanceConfig.isActive) {
      return;
    }

    instanceConfig.isActive = true;
    const side: CubeSide = instanceConfig.mapConfig.side;
    const instanceId: number = instanceConfig.instanceId;

    const position = { z: 0 };

    new TWEEN.Tween(position)
      .to({ z: 0.5 }, 150)
      .easing(TWEEN.Easing.Quartic.In)
      .onUpdate(() => {
        const targetPosition = new THREE.Vector3(0, 0, position.z);
        InstancesHelper.setLocalPositionToInstanceBySide(this.floorSpikesInstanced, instanceId, side, instanceConfig.startPosition, targetPosition);
      })
      .start();
  }

  private deactivateSpikes(id: number): void {
    const instanceConfig: IFloorSpikeInstanceConfig = this.getConfigById(id);

    if (!instanceConfig.isActive) {
      return;
    }

    instanceConfig.isActive = false;
    const side: CubeSide = instanceConfig.mapConfig.side;
    const instanceId: number = instanceConfig.instanceId;
    const position = { z: 0.5 };

    new TWEEN.Tween(position)
      .to({ z: 0 }, 250)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .onUpdate(() => {
        const targetPosition = new THREE.Vector3(0, 0, position.z);
        InstancesHelper.setLocalPositionToInstanceBySide(this.floorSpikesInstanced, instanceId, side, instanceConfig.startPosition, targetPosition);
      })
      .start();
  }

  private getConfigById(id: number) {
    return this.spikeInstanceConfig.filter((config) => config.mapConfig.id === id)[0];
  }
}
