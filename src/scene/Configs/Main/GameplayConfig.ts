import { CubeRotationAngleType } from "../../Enums/CubeRotationAngleType";
import { CubeRotationType } from "../../Enums/CubeRotationType";

const GameplayConfig = {
  grid: {
    size: 1,
    scale: 1,
  },
  cube: {
    rotationSpeed: {
      [CubeRotationType.Regular]: {
        [CubeRotationAngleType.Angle90]: 2.5,
        [CubeRotationAngleType.Angle180]: 1.8,
      },
      [CubeRotationType.ForRespawn]: {
        [CubeRotationAngleType.Angle90]: 3.4,
        [CubeRotationAngleType.Angle180]: 2,
      },
    },
  },
}

export default GameplayConfig;
