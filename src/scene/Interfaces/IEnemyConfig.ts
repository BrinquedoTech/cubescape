import * as THREE from 'three';
import { Direction } from '../Enums/Direction';
import { CubeSide } from '../Enums/CubeSide';
import { EnemyType } from '../Enums/EnemyType';

export interface IEnemyConfig {
  id?: number;
  position?: THREE.Vector2;
  side?: CubeSide;
}

export interface IWallSpikeConfig extends IEnemyConfig {
  directions: Direction[];
}

export interface ISkeletonConfig extends IEnemyConfig {
  health: number;
}

export type EnemyConfigMap = {
  [EnemyType.WallSpike]: IWallSpikeConfig;
};
