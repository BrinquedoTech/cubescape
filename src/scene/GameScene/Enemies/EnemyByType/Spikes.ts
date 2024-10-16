import * as THREE from 'three';
import { ISpikeConfig } from '../../../Interfaces/IEnemyConfig';
import CubeHelper from '../../../Helpers/CubeHelper';
import { CubeSide } from '../../../Enums/CubeSide';
import { ILevelConfig } from '../../../Interfaces/ILevelConfig';
import InstancesHelper from '../../../Helpers/InstancesHelper';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { Direction } from '../../../Enums/Direction';
import Loader from '../../../../core/loader';
import { SpikesGeneralConfig, SpikesTypeConfig } from '../../../Configs/Enemies/SpikesConfig';
import { SpikeType } from '../../../Enums/SpikeType';
import { ISpikesTypesConfig, ISpikeTypeRule } from '../../../Interfaces/ISpikesConfig';
import ArrayHelper from '../../../Helpers/ArrayHelper';

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

    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    const model: THREE.Mesh = Loader.assets['spikes_01'].scene.children[0];
    const modelGeometry: THREE.BufferGeometry = model.geometry.clone();

    const startRotation: THREE.Euler = SpikesGeneralConfig.modelStartRotation;
    const matrix: THREE.Matrix4 = new THREE.Matrix4();
    matrix.makeRotationFromEuler(startRotation);
    modelGeometry.applyMatrix4(matrix);

    for (let i = 0; i < this.configs.length; i++) {
      const config: ISpikeConfig = this.configs[i];
      const sidePosition: THREE.Vector2 = config.position;
      const side: CubeSide = config.side;
      const direction: Direction = config.directions[0];

      const spikeType: SpikeType = this.getSpikeType(config.directions);
      console.log(spikeType);

      const spike: THREE.Object3D = new THREE.Object3D();

      const position: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);
      spike.position.copy(position);

      CubeHelper.setSideRotation(spike, side);
      CubeHelper.setRotationByDirection(spike, side, direction);

      spikeObjects.push(spike);
    }

    const spikesInstanced = this.spikesInstanced = InstancesHelper.createStaticInstancedMesh(spikeObjects, material, modelGeometry);
    this.add(spikesInstanced);
  }

  public kill(): void {
    ThreeJSHelper.killInstancedMesh(this.spikesInstanced, this);
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
