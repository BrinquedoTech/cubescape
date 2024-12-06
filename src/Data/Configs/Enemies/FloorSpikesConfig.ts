import * as THREE from 'three';

const FloorSpikesGeneralConfig = {
  spikesStartPosition: new THREE.Vector3(0, 0, -0.8),
  geometryBaseRotation: new THREE.Euler(Math.PI * 0.5, 0, 0),
  geometrySpikeRotation: new THREE.Euler(0, 0, 0),
}

export { FloorSpikesGeneralConfig,  };