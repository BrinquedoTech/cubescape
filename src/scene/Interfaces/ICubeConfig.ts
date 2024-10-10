import * as THREE from 'three';
import { CubeEdge } from "../Enums/CubeEdge";
import { CubeRotationDirection } from "../Enums/CubeRotationDirection";
import { CubeSide } from "../Enums/CubeSide";
import { CubeEdgeOnSidePositionType } from '../Enums/CubeEdgeOnSide';

export interface IEdgeAxisConfig {
  edge: CubeEdge;
  axis: string;
}

export interface ICubeSurfaceAxisConfig {
  xAxis: string;
  yAxis: string;
  zAxis: string;
  xFactor: number;
  yFactor: number;
}

export interface ICharacterSurfaceConfig {
  xFactor: number;
  yFactor: number;
  zFactor: number;
  x: number;
  y: number;
  z: number;
}

export type ILocalEdgeDirections = {
  [key in CubeSide]: {
    [key in CubeRotationDirection]: THREE.Vector3;
  };
}

export type IEdgeBySideConfig = {
  [key in CubeSide]: {
    [key in CubeEdge]?: {
      positionType: CubeEdgeOnSidePositionType;
      direction: number;
    };
  };
}
