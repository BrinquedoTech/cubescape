import * as THREE from 'three';
import { ISpikeConfig } from '../../../Interfaces/IEnemyConfig';
import CubeHelper from '../../../Helpers/CubeHelper';
import { CubeSide } from '../../../Enums/CubeSide';
import { ILevelConfig } from '../../../Interfaces/ILevelConfig';
import InstancesHelper from '../../../Helpers/InstancesHelper';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { Direction } from '../../../Enums/Direction';
import { SpikesGeneralConfig, SpikesTypeConfig } from '../../../Configs/Enemies/SpikesConfig';
import { SpikeType } from '../../../Enums/SpikeType';
import { ISpikeByTypeDirections, ISpikesTypesConfig, ISpikeTypeRule } from '../../../Interfaces/ISpikesConfig';
import ArrayHelper from '../../../Helpers/ArrayHelper';

type ConfigByType = { [key in SpikeType]?: ISpikeConfig[] };

export default class Spikes extends THREE.Group {
  private configs: ISpikeConfig[];
  private levelConfig: ILevelConfig;
  private spikesInstancedByType: { [key in SpikeType]?: THREE.InstancedMesh } = {};

  constructor(configs: ISpikeConfig[]) {
    super();

    this.configs = configs;
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    const configByType: ConfigByType = this.createConfigByType();

    for (let spikeType in configByType) {
      const spikeObjects: THREE.Object3D[] = [];
      const configsByType: ISpikeConfig[] = configByType[spikeType];

      const modelName: string = SpikesTypeConfig[spikeType].model;
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      ThreeJSHelper.setGeometryRotation(geometry, SpikesGeneralConfig.modelStartRotation);

      for (let i = 0; i < configsByType.length; i++) {
        const config: ISpikeConfig = configsByType[i];
        const sidePosition: THREE.Vector2 = config.position;
        const side: CubeSide = config.side;

        const spike: THREE.Object3D = new THREE.Object3D();

        const position: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);
        spike.position.copy(position);

        const spikeModelDirection: Direction = this.getSpikeModelDirection(config.directions);
        CubeHelper.setSideRotation(spike, side);
        CubeHelper.setRotationByDirection(spike, side, spikeModelDirection);

        spikeObjects.push(spike);
      }

      const spikesInstanced = InstancesHelper.createStaticInstancedMesh(spikeObjects, material, geometry);
      this.add(spikesInstanced);
      this.spikesInstancedByType[spikeType] = spikesInstanced;
    }
  }

  public kill(): void {
    for (let spikeType in this.spikesInstancedByType) {
      const instancedMesh: THREE.InstancedMesh = this.spikesInstancedByType[spikeType];
      ThreeJSHelper.killInstancedMesh(instancedMesh, this);
    }
  }

  private createConfigByType(): ConfigByType {
    const configByType: ConfigByType = {};

    for (let i = 0; i < this.configs.length; i++) {
      const config: ISpikeConfig = this.configs[i];
      const spikeType: SpikeType = this.getSpikeType(config.directions);

      if (configByType[spikeType]) {
        configByType[spikeType].push(config);
      } else {
        configByType[spikeType] = [config];
      }
    }

    return configByType;
  }

  private getSpikeModelDirection(directions: Direction[]): Direction {
    const spikeType: SpikeType = this.getSpikeType(directions);
    const spikeTypeConfig: ISpikesTypesConfig = SpikesTypeConfig[spikeType];

    for (let i = 0; i < spikeTypeConfig.mainDirection.length; i++) {
      const directionConfig: ISpikeByTypeDirections = spikeTypeConfig.mainDirection[i];

      if (ArrayHelper.isArraysHasSameValues(directionConfig.type, directions)) {
        return directionConfig.modelDirection;
      }
    }

    return null;
  }

  private getSpikeType(directions: Direction[]): SpikeType {
    for (let type in SpikeType) {
      const spikeType: SpikeType = SpikeType[type];
      const spikeConfig: ISpikesTypesConfig = SpikesTypeConfig[spikeType];
      const rule: ISpikeTypeRule = spikeConfig.rule;

      if (rule.directionsCount === directions.length) {
        let isMatch: boolean = true;

        if (rule.directions) {
          let isDirectionsMatch: boolean = false;
          for (let i = 0; i < rule.directions.length; i++) {
            const ruleDirections: Direction[] = rule.directions[i];

            if (ArrayHelper.isArraysHasSameValues(ruleDirections, directions)) {
              isDirectionsMatch = true;
              break;
            }
          }

          isMatch = isDirectionsMatch;
        }

        if (isMatch) {
          return spikeType;
        }
      }
    }

    return null;
  }
}
