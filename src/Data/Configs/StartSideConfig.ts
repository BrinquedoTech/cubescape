import { CubeSide } from '../Enums/Cube/CubeSide';
import { CubeRotationDirection } from '../Enums/Cube/CubeRotationDirection';
import { RotateDirection, TurnDirection } from '../Enums/Cube/RotateDirection';
import { IDefaultStartSideConfig } from '../Interfaces/ICubeConfig';

const RotationBySideConfig: { [key in CubeSide]: RotateDirection[] } = {
  [CubeSide.Front]: [],
  [CubeSide.Right]: [RotateDirection.Right],
  [CubeSide.Back]: [RotateDirection.Right, RotateDirection.Right],
  [CubeSide.Left]: [RotateDirection.Left],
  [CubeSide.Top]: [RotateDirection.Up],
  [CubeSide.Bottom]: [RotateDirection.Down],
}

const TurnBySideConfig: { [key in CubeRotationDirection]: TurnDirection[] } = {
  [CubeRotationDirection.Top]: [],
  [CubeRotationDirection.Right]: [TurnDirection.CounterClockwise],
  [CubeRotationDirection.Bottom]: [TurnDirection.CounterClockwise, TurnDirection.CounterClockwise],
  [CubeRotationDirection.Left]: [TurnDirection.Clockwise],
}

const DefaultStartSideConfig: IDefaultStartSideConfig = {
  side: CubeSide.Front,
  rotationDirection: CubeRotationDirection.Top,
}

export {
  RotationBySideConfig,
  TurnBySideConfig,
  DefaultStartSideConfig,
};
