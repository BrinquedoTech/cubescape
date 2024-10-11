import * as THREE from 'three';
import { CubeRotationDirection } from "../Enums/CubeRotationDirection";
import { MoveDirection } from "../Enums/MoveDirection";
import { RotateDirection } from '../Enums/RotateDirection';

export type IMovementDirectionByCubeRotationConfig = {
    [key in MoveDirection]: {
        [key in CubeRotationDirection]: {
            position: THREE.Vector2;
            direction: MoveDirection;
            cubeRotationDirection: RotateDirection;
        };
    };
};

export interface IPlayerCharacterConfig {
  speedCoefficient: number;
}

export type IMovementDirectionConfig = {
  vector: THREE.Vector2;
  activeAxis: string;
  rotateDirection: RotateDirection;
}
