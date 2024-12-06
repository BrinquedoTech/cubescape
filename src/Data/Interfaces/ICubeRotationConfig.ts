import * as THREE from 'three';
import { CubeRotationDirection } from "../../Data/Enums/Cube/CubeRotationDirection";
import { CubeSide } from "../../Data/Enums/Cube/CubeSide";
import { RotateDirection, TurnDirection } from '../../Data/Enums/Cube/RotateDirection';

export type ITurnDirectionForRotationConfigType = {
  [key in CubeRotationDirection]: {
    [key in CubeRotationDirection]?: TurnDirection[];
  };
};

export type IRotationDirectionsFromSideToSideConfigType = {
  [key in CubeSide]: {
    [key in CubeSide]?: {
      [key in CubeRotationDirection]?: RotateDirection;
    };
  };
};

export interface IRotationAxisConfig {
  axis: THREE.Vector3;
  sign: number;
}
