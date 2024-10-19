import * as THREE from 'three';
import { CubeRotationDirection } from "../Enums/CubeRotationDirection";
import { CubeSide } from "../Enums/CubeSide";
import { RotateDirection, TurnDirection } from '../Enums/RotateDirection';

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
