import * as THREE from 'three';
import { CubeSide } from "../Enums/CubeSide";

export interface ILevelConfig {
  size: THREE.Vector3;
  map: {
    surfaces: ILevelMapConfig;
    edges: ILevelEdgeConfig;
  };
  playerCharacter: {
    gridPosition: THREE.Vector2;
    direction: number;
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