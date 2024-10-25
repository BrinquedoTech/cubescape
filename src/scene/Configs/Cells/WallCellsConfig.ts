import * as THREE from 'three';

const WallModelsConfig = {
  probabilities: [1],
  models: ['wall_01'],
}

const WallCellGeometryConfig = {
  rotation: new THREE.Euler(Math.PI * 0.5, Math.PI * 0.5, 0),
}



export { WallModelsConfig, WallCellGeometryConfig };
