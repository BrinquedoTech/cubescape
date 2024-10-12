import * as THREE from 'three';
import { CubeSide } from "../Enums/CubeSide";
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';

export interface ILevelConfig {
  size: THREE.Vector3;
  startSide?: {
    side?: CubeSide;
    rotationDirection?: CubeRotationDirection;
  },
  map: {
    surfaces: ILevelMapConfig;
    edges: ILevelEdgeConfig;
  };
  playerCharacter: {
    gridPosition: THREE.Vector2;
    side: CubeSide;
  };
}

export interface ILevelMapConfig {
  [key: string]: number[][];
}

export interface ILevelEdgeConfig {
  [key: string]: number[];
}

export type IMapConfig = {
  [key in CubeSide]?: number[][];
}