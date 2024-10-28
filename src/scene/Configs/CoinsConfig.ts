import * as THREE from 'three';

const CoinsConfig = {
  model: 'coin',
  geometryRotation: new THREE.Euler(0, 0, 0),
  hideScale: 0.001,
  idle: {
    rotationSpeed: 2,
    positionAmplitude: 0.13,
    positionFrequency: 3,
  }
}

export { CoinsConfig };