import { CubeRotationDirection } from "../Enums/CubeRotationDirection";
import { MoveDirection } from "../Enums/MoveDirection";
import { IMoveSurfaceDirectionConfig } from "../Interfaces/ICharacterConfig";

const MoveSurfaceDirectionConfig: IMoveSurfaceDirectionConfig = {
    [MoveDirection.Right]: {
      [CubeRotationDirection.Top]: { x: 1, y: 0 },
      [CubeRotationDirection.Bottom]: { x: -1, y: 0 },
      [CubeRotationDirection.Right]: { x: 0, y: 1 },
      [CubeRotationDirection.Left]: { x: 0, y: -1 },
    },
    [MoveDirection.Left]: {
      [CubeRotationDirection.Top]: { x: -1, y: 0 },
      [CubeRotationDirection.Bottom]: { x: 1, y: 0 },
      [CubeRotationDirection.Right]: { x: 0, y: -1 },
      [CubeRotationDirection.Left]: { x: 0, y: 1 },
    },
    [MoveDirection.Up]: {
      [CubeRotationDirection.Top]: { x: 0, y: -1 },
      [CubeRotationDirection.Bottom]: { x: 0, y: 1 },
      [CubeRotationDirection.Right]: { x: 1, y: 0 },
      [CubeRotationDirection.Left]: { x: -1, y: 0 },
    },
    [MoveDirection.Down]: {
      [CubeRotationDirection.Top]: { x: 0, y: 1 },
      [CubeRotationDirection.Bottom]: { x: 0, y: -1 },
      [CubeRotationDirection.Right]: { x: -1, y: 0 },
      [CubeRotationDirection.Left]: { x: 1, y: 0 },
    },
  }

export { MoveSurfaceDirectionConfig };