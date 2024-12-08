import * as THREE from 'three';
import { CubeRotationDirection } from "../../Enums/Cube/CubeRotationDirection";
import { CubeSide } from "../../Enums/Cube/CubeSide";
import { RotateDirection, TurnDirection } from "../../Enums/Cube/RotateDirection";
import { IRotationAxisConfig, IRotationDirectionsFromSideToSideConfigType, ITurnDirectionForRotationConfigType } from "../../Interfaces/ICubeRotationConfig";
import { CubeRotationAngleType } from '../../Enums/Cube/CubeRotationAngleType';

const CubeRotationAngle: { [key in CubeRotationAngleType]: number } = {
  [CubeRotationAngleType.Angle90]: Math.PI * 0.5,
  [CubeRotationAngleType.Angle180]: Math.PI,
}

const RotationAxisConfig: { [key in RotateDirection]: IRotationAxisConfig } = {
  [RotateDirection.Right]: { axis: new THREE.Vector3(0, 1, 0), sign: -1 },
  [RotateDirection.Left]: { axis: new THREE.Vector3(0, 1, 0), sign: 1 },
  [RotateDirection.Up]: { axis: new THREE.Vector3(1, 0, 0), sign: 1 },
  [RotateDirection.Down]: { axis: new THREE.Vector3(1, 0, 0), sign: -1 },
};

const TurnDirectionForRotationConfig: ITurnDirectionForRotationConfigType = {
  [CubeRotationDirection.Top]: {
    [CubeRotationDirection.Right]: [TurnDirection.CounterClockwise],
    [CubeRotationDirection.Bottom]: [TurnDirection.CounterClockwise, TurnDirection.CounterClockwise],
    [CubeRotationDirection.Left]: [TurnDirection.Clockwise],
  },
  [CubeRotationDirection.Right]: {
    [CubeRotationDirection.Top]: [TurnDirection.Clockwise],
    [CubeRotationDirection.Bottom]: [TurnDirection.CounterClockwise],
    [CubeRotationDirection.Left]: [TurnDirection.CounterClockwise, TurnDirection.CounterClockwise],
  },
  [CubeRotationDirection.Bottom]: {
    [CubeRotationDirection.Top]: [TurnDirection.Clockwise, TurnDirection.Clockwise],
    [CubeRotationDirection.Right]: [TurnDirection.Clockwise],
    [CubeRotationDirection.Left]: [TurnDirection.CounterClockwise],
  },
  [CubeRotationDirection.Left]: {
    [CubeRotationDirection.Top]: [TurnDirection.CounterClockwise],
    [CubeRotationDirection.Right]: [TurnDirection.Clockwise, TurnDirection.Clockwise],
    [CubeRotationDirection.Bottom]: [TurnDirection.Clockwise],
  },
};

const RotationDirectionsFromSideToSideConfig: IRotationDirectionsFromSideToSideConfigType = {
  [CubeSide.Front]: {
    [CubeSide.Left]: {
      [CubeRotationDirection.Top]: RotateDirection.Left,
      [CubeRotationDirection.Right]: RotateDirection.Up,
      [CubeRotationDirection.Bottom]: RotateDirection.Right,
      [CubeRotationDirection.Left]: RotateDirection.Down, 
    },
    [CubeSide.Right]: {
      [CubeRotationDirection.Top]: RotateDirection.Right,
      [CubeRotationDirection.Right]: RotateDirection.Down,
      [CubeRotationDirection.Bottom]: RotateDirection.Left,
      [CubeRotationDirection.Left]: RotateDirection.Up, 
    },
    [CubeSide.Top]: {
      [CubeRotationDirection.Top]: RotateDirection.Up,
      [CubeRotationDirection.Right]: RotateDirection.Right,
      [CubeRotationDirection.Bottom]: RotateDirection.Down,
      [CubeRotationDirection.Left]: RotateDirection.Left, 
    },
    [CubeSide.Bottom]: {
      [CubeRotationDirection.Top]: RotateDirection.Down,
      [CubeRotationDirection.Right]: RotateDirection.Left,
      [CubeRotationDirection.Bottom]: RotateDirection.Up,
      [CubeRotationDirection.Left]: RotateDirection.Right, 
    },
  },
  [CubeSide.Left]: {
    [CubeSide.Front]: {
      [CubeRotationDirection.Top]: RotateDirection.Right, // good
      [CubeRotationDirection.Right]: RotateDirection.Up, // good
      [CubeRotationDirection.Bottom]: RotateDirection.Left, // good
      [CubeRotationDirection.Left]: RotateDirection.Down, // good
    },
    [CubeSide.Back]: {
      [CubeRotationDirection.Top]: RotateDirection.Left,
      [CubeRotationDirection.Right]: RotateDirection.Down,
      [CubeRotationDirection.Bottom]: RotateDirection.Right,
      [CubeRotationDirection.Left]: RotateDirection.Up, 
    },
    [CubeSide.Top]: {
      [CubeRotationDirection.Top]: RotateDirection.Up,
      [CubeRotationDirection.Right]: RotateDirection.Right,
      [CubeRotationDirection.Bottom]: RotateDirection.Down,
      [CubeRotationDirection.Left]: RotateDirection.Left, 
    },
    [CubeSide.Bottom]: {
      [CubeRotationDirection.Top]: RotateDirection.Down,
      [CubeRotationDirection.Right]: RotateDirection.Left,
      [CubeRotationDirection.Bottom]: RotateDirection.Up,
      [CubeRotationDirection.Left]: RotateDirection.Right, 
    },
  },
  [CubeSide.Right]: {
    [CubeSide.Front]: {
      [CubeRotationDirection.Top]: RotateDirection.Left, // good
      [CubeRotationDirection.Right]: RotateDirection.Down, // good
      [CubeRotationDirection.Bottom]: RotateDirection.Right, // good
      [CubeRotationDirection.Left]: RotateDirection.Up, // good
    },
    [CubeSide.Back]: {
      [CubeRotationDirection.Top]: RotateDirection.Right,
      [CubeRotationDirection.Right]: RotateDirection.Down,
      [CubeRotationDirection.Bottom]: RotateDirection.Left,
      [CubeRotationDirection.Left]: RotateDirection.Up, 
    },
    [CubeSide.Top]: {
      [CubeRotationDirection.Top]: RotateDirection.Up,
      [CubeRotationDirection.Right]: RotateDirection.Right,
      [CubeRotationDirection.Bottom]: RotateDirection.Down,
      [CubeRotationDirection.Left]: RotateDirection.Left, 
    },
    [CubeSide.Bottom]: {
      [CubeRotationDirection.Top]: RotateDirection.Down,
      [CubeRotationDirection.Right]: RotateDirection.Left,
      [CubeRotationDirection.Bottom]: RotateDirection.Up,
      [CubeRotationDirection.Left]: RotateDirection.Right, 
    },
  },
  [CubeSide.Top]: {
    [CubeSide.Front]: {
      [CubeRotationDirection.Top]: RotateDirection.Down, // good
      [CubeRotationDirection.Right]: RotateDirection.Right, // good
      [CubeRotationDirection.Bottom]: RotateDirection.Up, // good
      [CubeRotationDirection.Left]: RotateDirection.Left,  // good
    },
    [CubeSide.Back]: {
      [CubeRotationDirection.Top]: RotateDirection.Up,
      [CubeRotationDirection.Right]: RotateDirection.Right,
      [CubeRotationDirection.Bottom]: RotateDirection.Down,
      [CubeRotationDirection.Left]: RotateDirection.Left, 
    },
    [CubeSide.Left]: {
      [CubeRotationDirection.Top]: RotateDirection.Left, // good
      [CubeRotationDirection.Right]: RotateDirection.Down, // good
      [CubeRotationDirection.Bottom]: RotateDirection.Right, // good
      [CubeRotationDirection.Left]: RotateDirection.Up,  // good
    },
    [CubeSide.Right]: {
      [CubeRotationDirection.Top]: RotateDirection.Right,
      [CubeRotationDirection.Right]: RotateDirection.Down,
      [CubeRotationDirection.Bottom]: RotateDirection.Left,
      [CubeRotationDirection.Left]: RotateDirection.Up, 
    },
  },
  [CubeSide.Bottom]: {
    [CubeSide.Front]: {
      [CubeRotationDirection.Top]: RotateDirection.Up, // good
      [CubeRotationDirection.Right]: RotateDirection.Left, // good
      [CubeRotationDirection.Bottom]: RotateDirection.Down, // good
      [CubeRotationDirection.Left]: RotateDirection.Right,  // good
    },
    [CubeSide.Back]: {
      [CubeRotationDirection.Top]: RotateDirection.Down,
      [CubeRotationDirection.Right]: RotateDirection.Left,
      [CubeRotationDirection.Bottom]: RotateDirection.Up,
      [CubeRotationDirection.Left]: RotateDirection.Right, 
    },
    [CubeSide.Left]: {
      [CubeRotationDirection.Top]: RotateDirection.Left,   // good
      [CubeRotationDirection.Right]: RotateDirection.Down,  // good
      [CubeRotationDirection.Bottom]: RotateDirection.Right,  // good
      [CubeRotationDirection.Left]: RotateDirection.Up,   // good
    },
    [CubeSide.Right]: {
      [CubeRotationDirection.Top]: RotateDirection.Right,
      [CubeRotationDirection.Right]: RotateDirection.Down,
      [CubeRotationDirection.Bottom]: RotateDirection.Left,
      [CubeRotationDirection.Left]: RotateDirection.Up, 
    },
  },
  [CubeSide.Back]: {
    [CubeSide.Left]: {
      [CubeRotationDirection.Top]: RotateDirection.Right,
      [CubeRotationDirection.Right]: RotateDirection.Up,
      [CubeRotationDirection.Bottom]: RotateDirection.Left,
      [CubeRotationDirection.Left]: RotateDirection.Down, 
    },
    [CubeSide.Right]: {
      [CubeRotationDirection.Top]: RotateDirection.Left,
      [CubeRotationDirection.Right]: RotateDirection.Down,
      [CubeRotationDirection.Bottom]: RotateDirection.Right,
      [CubeRotationDirection.Left]: RotateDirection.Up, 
    },
    [CubeSide.Top]: {
      [CubeRotationDirection.Top]: RotateDirection.Down,
      [CubeRotationDirection.Right]: RotateDirection.Right,
      [CubeRotationDirection.Bottom]: RotateDirection.Up,
      [CubeRotationDirection.Left]: RotateDirection.Left, 
    },
    [CubeSide.Bottom]: {
      [CubeRotationDirection.Top]: RotateDirection.Up,
      [CubeRotationDirection.Right]: RotateDirection.Left,
      [CubeRotationDirection.Bottom]: RotateDirection.Down,
      [CubeRotationDirection.Left]: RotateDirection.Right, 
    },
  },
};

export {
  TurnDirectionForRotationConfig,
  RotationDirectionsFromSideToSideConfig,
  CubeRotationAngle,
  RotationAxisConfig,
};