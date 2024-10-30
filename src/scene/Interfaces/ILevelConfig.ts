import * as THREE from 'three';
import { CubeSide } from "../Enums/CubeSide";
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';
import { CubeEdge } from '../Enums/CubeEdge';
import { EnemyType } from '../Enums/EnemyType';
import { EnemyConfigMap } from './IEnemyConfig';
import { SceneType } from '../Enums/SceneType';

export interface ILevelConfig {
  size?: THREE.Vector3;
  startSide?: {
    side?: CubeSide;
    rotationDirection?: CubeRotationDirection;
  };
  map: {
    sides: ILevelSideConfig;
    edges: ILevelEdgeConfig;
  };
  enemies?: IEnemiesConfig;
  sceneType?: SceneType;
}

export type ILevelSideConfig = {
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