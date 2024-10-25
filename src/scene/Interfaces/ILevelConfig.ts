import * as THREE from 'three';
import { CubeSide } from "../Enums/CubeSide";
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';
import { CubeEdge } from '../Enums/CubeEdge';
import { EnemyType } from '../Enums/EnemyType';
import { EnemyConfigMap } from './IEnemyConfig';

export interface ILevelConfig {
  size: THREE.Vector3;
  startSide?: {
    side?: CubeSide;
    rotationDirection?: CubeRotationDirection;
  };
  map: {
    sides: ILevelMapConfig;
    edges: ILevelEdgeConfig;
  };
  enemies?: IEnemiesConfig;
}

export type ILevelMapConfig = {
  [key in CubeSide]?: string[][];
}

export type ILevelEdgeConfig = {
  [key in CubeEdge]?: string[];
}

export type IMapConfig = {
  [key in CubeSide]?: string[][];
}

export type IEnemiesConfig = {
  [key in EnemyType]?: EnemyConfigMap[key][];
}