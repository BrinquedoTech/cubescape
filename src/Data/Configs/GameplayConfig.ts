import { CubeRotationAngleType } from "../Enums/Cube/CubeRotationAngleType";
import { CubeRotationType } from "../Enums/Cube/CubeRotationType";

const GameplayConfig = {
  grid: {
    size: 1,
    scale: 1,
  },
  lives: 5,
  cube: {
    rotationSpeed: {
      [CubeRotationType.Regular]: {
        [CubeRotationAngleType.Angle90]: 1.8,
        [CubeRotationAngleType.Angle180]: 1.5,
      },
      [CubeRotationType.ForRespawn]: {
        [CubeRotationAngleType.Angle90]: 3.4,
        [CubeRotationAngleType.Angle180]: 2,
      },
    },
  },
}

export default GameplayConfig;
