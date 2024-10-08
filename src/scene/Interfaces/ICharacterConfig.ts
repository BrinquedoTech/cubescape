import * as THREE from 'three';
import { CubeRotationDirection } from "../Enums/CubeRotationDirection";
import { MoveDirection } from "../Enums/MoveDirection";

export type IMovementDirectionByCubeRotationConfig = {
    [key in MoveDirection]: {
        [key in CubeRotationDirection]: {
            position: THREE.Vector2;
            direction: MoveDirection;
        };
    };
};

export interface IPlayerCharacterConfig {
  speedCoefficient: number;
}
