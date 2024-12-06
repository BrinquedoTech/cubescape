import * as THREE from 'three';
import { Direction } from '../../Enums/Direction';
import { CubeSide } from '../../Enums/Cube/CubeSide';
import { EnemyType } from '../../Enums/Enemy/EnemyType';

export interface IEnemyConfig {
  id?: number;
  position?: THREE.Vector2;
  side?: CubeSide;
}

export interface IWallSpikeConfig extends IEnemyConfig {
  directions?: Direction[];
}

export interface IFloorSpikeConfig extends IEnemyConfig {
  inactiveTime?: number;
  activeTime?: number;
}

export type EnemyConfigMap = {
  [EnemyType.WallSpike]: IWallSpikeConfig;
  [EnemyType.FloorSpike]: IFloorSpikeConfig;
};
