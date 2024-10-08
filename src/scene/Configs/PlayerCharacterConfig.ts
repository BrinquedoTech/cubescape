import * as THREE from 'three';
import { CubeRotationDirection } from "../Enums/CubeRotationDirection";
import { MoveDirection } from "../Enums/MoveDirection";
import { IMovementDirectionByCubeRotationConfig, IPlayerCharacterConfig } from "../Interfaces/ICharacterConfig";
import { ButtonType } from '../Enums/ButtonType';

const PlayerCharacterConfig: IPlayerCharacterConfig = {
  speedCoefficient: 0.07,
}

const MovementDirectionByCubeRotationConfig: IMovementDirectionByCubeRotationConfig = {
  [MoveDirection.Right]: {
    [CubeRotationDirection.Top]: {
      position: new THREE.Vector2(1, 0),
      direction: MoveDirection.Right,
    },
    [CubeRotationDirection.Bottom]: {
      position: new THREE.Vector2(-1, 0),
      direction: MoveDirection.Left,
    },
    [CubeRotationDirection.Right]: {
      position: new THREE.Vector2(0, 1),
      direction: MoveDirection.Down,
    },
    [CubeRotationDirection.Left]: {
      position: new THREE.Vector2(0, -1),
      direction: MoveDirection.Up,
    },
  },
  [MoveDirection.Left]: {
    [CubeRotationDirection.Top]: {
      position: new THREE.Vector2(-1, 0),
      direction: MoveDirection.Left,
    },
    [CubeRotationDirection.Bottom]: {
      position: new THREE.Vector2(1, 0),
      direction: MoveDirection.Right,
    },
    [CubeRotationDirection.Right]: {
      position: new THREE.Vector2(0, -1),
      direction: MoveDirection.Up,
    },
    [CubeRotationDirection.Left]: {
      position: new THREE.Vector2(0, 1),
      direction: MoveDirection.Down,
    },
  },
  [MoveDirection.Up]: {
    [CubeRotationDirection.Top]: {
      position: new THREE.Vector2(0, -1),
      direction: MoveDirection.Up,
    },
    [CubeRotationDirection.Bottom]: {
      position: new THREE.Vector2(0, 1),
      direction: MoveDirection.Down,
    },
    [CubeRotationDirection.Right]: {
      position: new THREE.Vector2(1, 0),
      direction: MoveDirection.Right,
    },
    [CubeRotationDirection.Left]: {
      position: new THREE.Vector2(-1, 0),
      direction: MoveDirection.Left
    },
  },
  [MoveDirection.Down]: {
    [CubeRotationDirection.Top]: {
      position: new THREE.Vector2(0, 1),
      direction: MoveDirection.Down,
    },
    [CubeRotationDirection.Bottom]: {
      position: new THREE.Vector2(0, -1),
      direction: MoveDirection.Up,
    },
    [CubeRotationDirection.Right]: {
      position: new THREE.Vector2(-1, 0),
      direction: MoveDirection.Left,
    },
    [CubeRotationDirection.Left]: {
      position: new THREE.Vector2(1, 0),
      direction: MoveDirection.Right,
    },
  },
}

const MovementDirectionConfig: { [key in MoveDirection]: { vector: THREE.Vector2, activeAxis: string } } = {
  [MoveDirection.Up]: {
    vector: new THREE.Vector2(0, -1),
    activeAxis: 'y',
  },
  [MoveDirection.Down]: {
    vector: new THREE.Vector2(0, 1),
    activeAxis: 'y',
  },
  [MoveDirection.Left]: {
    vector: new THREE.Vector2(-1, 0),
    activeAxis: 'x',
  },
  [MoveDirection.Right]: {
    vector: new THREE.Vector2(1, 0),
    activeAxis: 'x',
  },
};

const MovementDirectionByButtonConfig: { [key in ButtonType]: MoveDirection } = {
  [ButtonType.Right]: MoveDirection.Right,
  [ButtonType.Left]: MoveDirection.Left,
  [ButtonType.Up]: MoveDirection.Up,
  [ButtonType.Down]: MoveDirection.Down,
};

export { MovementDirectionByCubeRotationConfig, MovementDirectionConfig, MovementDirectionByButtonConfig, PlayerCharacterConfig };