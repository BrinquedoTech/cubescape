import * as THREE from 'three';
import { CubeSide } from "../Enums/CubeSide";

export interface ILevelConfig {
  playCharacter: {
    gridPosition: THREE.Vector2;
    direction: number;
    side: CubeSide;
  };
  size: number;
  map: {
    surfaces: ILevelMapConfig;
    edges: ILevelEdgeConfig;
  },
}

export interface ILevelMapConfig {
  [key: string]: number[][];
}

export interface ILevelEdgeConfig {
  [key: string]: number[];
}