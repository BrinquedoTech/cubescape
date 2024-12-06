import * as THREE from 'three';
import { CubeRotationDirection } from "../Enums/Cube/CubeRotationDirection";
import { MoveDirection } from "../Enums/MoveDirection";
import { ICharacterRotationToSideConfig, IMovementDirectionByCubeRotationConfig, IMovementDirectionConfig } from "../Interfaces/ICharacterConfig";
import { ButtonType } from '../Enums/ButtonType';
import { RotateDirection } from '../Enums/Cube/RotateDirection';
import { Direction } from '../Enums/Direction';
import { CubeSide } from '../Enums/Cube/CubeSide';

const MovementDirectionByCubeRotationConfig: IMovementDirectionByCubeRotationConfig = {
  [MoveDirection.Right]: {
    [CubeRotationDirection.Top]: {
      position: new THREE.Vector2(1, 0),
      direction: MoveDirection.Right,
      cubeRotationDirection: RotateDirection.Right,
    },
    [CubeRotationDirection.Bottom]: {
      position: new THREE.Vector2(-1, 0),
      direction: MoveDirection.Left,
      cubeRotationDirection: RotateDirection.Left,
    },
    [CubeRotationDirection.Right]: {
      position: new THREE.Vector2(0, 1),
      direction: MoveDirection.Down,
      cubeRotationDirection: RotateDirection.Up,
    },
    [CubeRotationDirection.Left]: {
      position: new THREE.Vector2(0, -1),
      direction: MoveDirection.Up,
      cubeRotationDirection: RotateDirection.Down,
    },
  },
  [MoveDirection.Left]: {
    [CubeRotationDirection.Top]: {
      position: new THREE.Vector2(-1, 0),
      direction: MoveDirection.Left,
      cubeRotationDirection: RotateDirection.Left,
    },
    [CubeRotationDirection.Bottom]: {
      position: new THREE.Vector2(1, 0),
      direction: MoveDirection.Right,
      cubeRotationDirection: RotateDirection.Right,
    },
    [CubeRotationDirection.Right]: {
      position: new THREE.Vector2(0, -1),
      direction: MoveDirection.Up,
      cubeRotationDirection: RotateDirection.Down,
    },
    [CubeRotationDirection.Left]: {
      position: new THREE.Vector2(0, 1),
      direction: MoveDirection.Down,
      cubeRotationDirection: RotateDirection.Up,
    },
  },
  [MoveDirection.Up]: {
    [CubeRotationDirection.Top]: {
      position: new THREE.Vector2(0, -1),
      direction: MoveDirection.Up,
      cubeRotationDirection: RotateDirection.Up,
    },
    [CubeRotationDirection.Bottom]: {
      position: new THREE.Vector2(0, 1),
      direction: MoveDirection.Down,
      cubeRotationDirection: RotateDirection.Down,
    },
    [CubeRotationDirection.Right]: {
      position: new THREE.Vector2(1, 0),
      direction: MoveDirection.Right,
      cubeRotationDirection: RotateDirection.Left,
    },
    [CubeRotationDirection.Left]: {
      position: new THREE.Vector2(-1, 0),
      direction: MoveDirection.Left,
      cubeRotationDirection: RotateDirection.Right,
    },
  },
  [MoveDirection.Down]: {
    [CubeRotationDirection.Top]: {
      position: new THREE.Vector2(0, 1),
      direction: MoveDirection.Down,
      cubeRotationDirection: RotateDirection.Down,
    },
    [CubeRotationDirection.Bottom]: {
      position: new THREE.Vector2(0, -1),
      direction: MoveDirection.Up,
      cubeRotationDirection: RotateDirection.Up,
    },
    [CubeRotationDirection.Right]: {
      position: new THREE.Vector2(-1, 0),
      direction: MoveDirection.Left,
      cubeRotationDirection: RotateDirection.Right,
    },
    [CubeRotationDirection.Left]: {
      position: new THREE.Vector2(1, 0),
      direction: MoveDirection.Right,
      cubeRotationDirection: RotateDirection.Left,
    },
  },
}

const MovementDirectionConfig: { [key in MoveDirection]: IMovementDirectionConfig } = {
  [MoveDirection.Up]: {
    vector: new THREE.Vector2(0, -1),
    activeAxis: 'y',
    rotateDirection: RotateDirection.Up,
  },
  [MoveDirection.Down]: {
    vector: new THREE.Vector2(0, 1),
    activeAxis: 'y',
    rotateDirection: RotateDirection.Down,
  },
  [MoveDirection.Left]: {
    vector: new THREE.Vector2(-1, 0),
    activeAxis: 'x',
    rotateDirection: RotateDirection.Left,
  },
  [MoveDirection.Right]: {
    vector: new THREE.Vector2(1, 0),
    activeAxis: 'x',
    rotateDirection: RotateDirection.Right,
  },
}

const MovementDirectionByButtonConfig: { [key in ButtonType]?: MoveDirection } = {
  [ButtonType.Right]: MoveDirection.Right,
  [ButtonType.Left]: MoveDirection.Left,
  [ButtonType.Up]: MoveDirection.Up,
  [ButtonType.Down]: MoveDirection.Down,
}

const TiltAxisConfig: { [key in MoveDirection]: { axis: string, sign: number }} = {
  [MoveDirection.Up]: { axis: 'x', sign: -1 },
  [MoveDirection.Down]: { axis: 'x', sign: 1 },
  [MoveDirection.Left]: { axis: 'y', sign: -1 },
  [MoveDirection.Right]: { axis: 'y', sign: 1 },
}

const ButtonTypeByDirection: { [key in Direction]: ButtonType } = {
  [Direction.Up]: ButtonType.Up,
  [Direction.Down]: ButtonType.Down,
  [Direction.Left]: ButtonType.Left,
  [Direction.Right]: ButtonType.Right,
}

const CharacterRotationToSideConfig: { [key in CubeSide]: { [key in CubeSide]?: ICharacterRotationToSideConfig } } = {
  [CubeSide.Front]: {
    [CubeSide.Left]: { axis: new THREE.Vector3(0, 1, 0), sign: -1 },
    [CubeSide.Right]: { axis: new THREE.Vector3(0, 1, 0), sign: 1 },
    [CubeSide.Top]: { axis: new THREE.Vector3(1, 0, 0), sign: -1 },
    [CubeSide.Bottom]: { axis: new THREE.Vector3(1, 0, 0), sign: 1 },
  },
  [CubeSide.Left]: {
    [CubeSide.Front]: { axis: new THREE.Vector3(0, 1, 0), sign: 1 },
    [CubeSide.Back]: { axis: new THREE.Vector3(0, 1, 0), sign: -1 },
    [CubeSide.Top]: { axis: new THREE.Vector3(0, 0, 1), sign: -1 },
    [CubeSide.Bottom]: { axis: new THREE.Vector3(0, 0, 1), sign: 1 },
  },
  [CubeSide.Right]: {
    [CubeSide.Front]: { axis: new THREE.Vector3(0, 1, 0), sign: -1 },
    [CubeSide.Back]: { axis: new THREE.Vector3(0, 1, 0), sign: 1 },
    [CubeSide.Top]: { axis: new THREE.Vector3(0, 0, 1), sign: 1 },
    [CubeSide.Bottom]: { axis: new THREE.Vector3(0, 0, 1), sign: -1 },
  },
  [CubeSide.Top]: {
    [CubeSide.Front]: { axis: new THREE.Vector3(1, 0, 0), sign: 1 },
    [CubeSide.Left]: { axis: new THREE.Vector3(0, 0, 1), sign: 1 },
    [CubeSide.Right]: { axis: new THREE.Vector3(0, 0, 1), sign: -1 },
    [CubeSide.Back]: { axis: new THREE.Vector3(1, 0, 0), sign: -1 },
  },
  [CubeSide.Bottom]: {
    [CubeSide.Front]: { axis: new THREE.Vector3(1, 0, 0), sign: -1 },
    [CubeSide.Left]: { axis: new THREE.Vector3(0, 0, 1), sign: -1 },
    [CubeSide.Right]: { axis: new THREE.Vector3(0, 0, 1), sign: 1 },
    [CubeSide.Back]: { axis: new THREE.Vector3(1, 0, 0), sign: 1 },
  },
  [CubeSide.Back]: {
    [CubeSide.Left]: { axis: new THREE.Vector3(0, 1, 0), sign: 1 },
    [CubeSide.Right]: { axis: new THREE.Vector3(0, 1, 0), sign: -1 },
    [CubeSide.Top]: { axis: new THREE.Vector3(1, 0, 0), sign: 1 },
    [CubeSide.Bottom]: { axis: new THREE.Vector3(1, 0, 0), sign: -1 },
  },
};

export {
  MovementDirectionByCubeRotationConfig,
  MovementDirectionConfig,
  MovementDirectionByButtonConfig,
  TiltAxisConfig,
  ButtonTypeByDirection,
  CharacterRotationToSideConfig,
};