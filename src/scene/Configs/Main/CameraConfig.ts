import { DeviceState } from "../../Enums/DeviceState";

const CameraConfig = {
  settings: {
    fov: 50,
    near: 1,
    far: 70,
  },
  distanceFromCube: {
    static: 20,
    dynamic: {
      enable: true,
      lerpFactor: 0.06,
      [DeviceState.Desktop]: {
        start: 9,
        sideCoefficient: 1.5,
      },
      [DeviceState.Mobile]: {
        start: 12,
        sideCoefficient: 2.5,
      }
    }
  },
  followPlayer: {
    enabled: false,
    lerpFactor: 0.1,
    lerpFactorCubeRotating: 0.5,
  },
  lookAtPlayer: {
    enabled: false,
    lerpFactor: 0.03,
    lerpFactorCubeRotating: 0.5,
  },
  rotationByPlayerPosition: {
    enabled: true,
    lerpFactor: 0.015,
    distanceCoefficient: 0.5,
  },
}

export default CameraConfig;
