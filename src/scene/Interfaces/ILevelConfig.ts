import * as THREE from 'three';
import { CubeSide } from "../Enums/CubeSide";
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';
import { CubeEdge } from '../Enums/CubeEdge';

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
}

export type ILevelMapConfig = {
  [key in CubeSide]: string[][];
}

export type ILevelEdgeConfig = {
  [key in CubeEdge]?: string[];
}

export type IMapConfig = {
  [key in CubeSide]?: string[][];
}