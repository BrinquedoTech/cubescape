import * as THREE from 'three';
import { CubeRotationDirection } from "../../Data/Enums/Cube/CubeRotationDirection";
import { MoveDirection } from "../../Data/Enums/MoveDirection";
import { RotateDirection } from '../../Data/Enums/Cube/RotateDirection';

export type IMovementDirectionByCubeRotationConfig = {
    [key in MoveDirection]: {
        [key in CubeRotationDirection]: {
            position: THREE.Vector2;
            direction: MoveDirection;
            cubeRotationDirection: RotateDirection;
        };
    };
};

export type IMovementDirectionConfig = {
  vector: THREE.Vector2;
  activeAxis: string;
  rotateDirection: RotateDirection;
}

export type ICharacterRotationToSideConfig = {
  axis: THREE.Vector3;
  sign: number;
};
