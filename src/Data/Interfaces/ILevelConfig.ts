import * as THREE from 'three';
import { CubeSide } from "../../Data/Enums/Cube/CubeSide";
import { CubeRotationDirection } from '../../Data/Enums/Cube/CubeRotationDirection';
import { CubeEdge } from '../../Data/Enums/Cube/CubeEdge';
import { EnemyType } from '../../Data/Enums/Enemy/EnemyType';
import { EnemyConfigMap } from './Enemies/IEnemyConfig';
import { SceneType } from '../../Data/Enums/SceneType';

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