import * as THREE from 'three';

const WallModelsConfig = {
  probabilities: [0.9, 0.1],
  models: ['wall_01', 'wall_02'],
}

const WallCellGeometryConfig = {
  rotation: new THREE.Euler(Math.PI * 0.5, 0, 0),
}



export { WallModelsConfig, WallCellGeometryConfig };
