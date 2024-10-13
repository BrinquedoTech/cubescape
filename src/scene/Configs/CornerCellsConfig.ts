import * as THREE from 'three';

const CornerCellsConfig: THREE.Vector3[] = [
  new THREE.Vector3(-1, 1, 1),
  new THREE.Vector3(1, 1, 1),
  new THREE.Vector3(1, 1, -1),
  new THREE.Vector3(-1, 1, -1),
  new THREE.Vector3(-1, -1, 1),
  new THREE.Vector3(1, -1, 1),
  new THREE.Vector3(1, -1, -1),
  new THREE.Vector3(-1, -1, -1),
];

export default CornerCellsConfig;
