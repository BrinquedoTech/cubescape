const CameraConfig = {
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
    enabled: false,
    lerpFactor: 0.015,
    distanceCoefficient: 0.5,
  }
}

export default CameraConfig;
