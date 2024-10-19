import * as THREE from 'three';
import { IWallSpikeConfig } from '../../../Interfaces/IEnemyConfig';
import CubeHelper from '../../../Helpers/CubeHelper';
import { CubeSide } from '../../../Enums/CubeSide';
import { ILevelConfig } from '../../../Interfaces/ILevelConfig';
import InstancesHelper from '../../../Helpers/InstancesHelper';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { Direction } from '../../../Enums/Direction';
import { WallSpikesGeneralConfig, WallSpikesTypeConfig } from '../../../Configs/Enemies/SpikesConfig';
import { WallSpikeType } from '../../../Enums/WallSpikeType';
import { IWallSpikeByTypeDirections, IWallSpikesTypesConfig, IWallSpikeTypeRule } from '../../../Interfaces/ISpikesConfig';
import ArrayHelper from '../../../Helpers/ArrayHelper';

type ConfigByType = { [key in WallSpikeType]?: IWallSpikeConfig[] };

export default class WallSpikes extends THREE.Group {
  private configs: IWallSpikeConfig[];
  private levelConfig: ILevelConfig;
  private wallSpikesInstancedByType: { [key in WallSpikeType]?: THREE.InstancedMesh } = {};

  constructor(configs: IWallSpikeConfig[]) {
    super();

    this.configs = configs;
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });

    const configByType: ConfigByType = this.createConfigByType();

    for (let wallSpikeType in configByType) {
      const wallSpikeObjects: THREE.Object3D[] = [];
      const configsByType: IWallSpikeConfig[] = configByType[wallSpikeType];

      const modelName: string = WallSpikesTypeConfig[wallSpikeType].model;
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);
      ThreeJSHelper.setGeometryRotation(geometry, WallSpikesGeneralConfig.modelStartRotation);

      for (let i = 0; i < configsByType.length; i++) {
        const config: IWallSpikeConfig = configsByType[i];
        const sidePosition: THREE.Vector2 = config.position;
        const side: CubeSide = config.side;

        const wallSpike: THREE.Object3D = new THREE.Object3D();

        const position: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);
        wallSpike.position.copy(position);

        const wallsSpikeModelDirection: Direction = this.getWallSpikeModelDirection(config.directions);
        CubeHelper.setSideRotation(wallSpike, side);
        CubeHelper.setRotationByDirection(wallSpike, side, wallsSpikeModelDirection);

        wallSpikeObjects.push(wallSpike);
      }

      const wallSpikesInstanced = InstancesHelper.createStaticInstancedMesh(wallSpikeObjects, material, geometry);
      this.add(wallSpikesInstanced);
      this.wallSpikesInstancedByType[wallSpikeType] = wallSpikesInstanced;
    }
  }

  public kill(): void {
    for (let wallSpikeType in this.wallSpikesInstancedByType) {
      const instancedMesh: THREE.InstancedMesh = this.wallSpikesInstancedByType[wallSpikeType];
      ThreeJSHelper.killInstancedMesh(instancedMesh, this);
    }
  }

  private createConfigByType(): ConfigByType {
    const configByType: ConfigByType = {};

    for (let i = 0; i < this.configs.length; i++) {
      const config: IWallSpikeConfig = this.configs[i];
      const wallSpikeType: WallSpikeType = this.getWallSpikeType(config.directions);

      if (configByType[wallSpikeType]) {
        configByType[wallSpikeType].push(config);
      } else {
        configByType[wallSpikeType] = [config];
      }
    }

    return configByType;
  }

  private getWallSpikeModelDirection(directions: Direction[]): Direction {
    const wallSpikeType: WallSpikeType = this.getWallSpikeType(directions);
    const wallSpikeTypeConfig: IWallSpikesTypesConfig = WallSpikesTypeConfig[wallSpikeType];

    for (let i = 0; i < wallSpikeTypeConfig.mainDirection.length; i++) {
      const directionConfig: IWallSpikeByTypeDirections = wallSpikeTypeConfig.mainDirection[i];

      if (ArrayHelper.isArraysHasSameValues(directionConfig.type, directions)) {
        return directionConfig.modelDirection;
      }
    }

    return null;
  }

  private getWallSpikeType(directions: Direction[]): WallSpikeType {
    for (let type in WallSpikeType) {
      const wallSpikeType: WallSpikeType = WallSpikeType[type];
      const wallSpikeConfig: IWallSpikesTypesConfig = WallSpikesTypeConfig[wallSpikeType];
      const rule: IWallSpikeTypeRule = wallSpikeConfig.rule;

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
          return wallSpikeType;
        }
      }
    }

    return null;
  }
}
