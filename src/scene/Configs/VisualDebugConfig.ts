import * as THREE from 'three';
import { CubeSide } from '../Enums/CubeSide';
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';

const CubeSideName: { [key in CubeSide]: string } = {
  [CubeSide.Front]: 'Front',
  [CubeSide.Back]: 'Back',
  [CubeSide.Left]: 'Left',
  [CubeSide.Right]: 'Right',
  [CubeSide.Top]: 'Top',
  [CubeSide.Bottom]: 'Bottom',
}

const CubeEdgeName: { [key in CubeRotationDirection]: string } = {
  [CubeRotationDirection.Top]: 'Top',
  [CubeRotationDirection.Bottom]: 'Bottom',
  [CubeRotationDirection.Right]: 'Right',
  [CubeRotationDirection.Left]: 'Left',
};

const CubeEdgeNameVectorsConfig: { [key in CubeRotationDirection]: { position: THREE.Vector3, rotation: THREE.Vector3 }} = {
  [CubeRotationDirection.Top]: {
    position: new THREE.Vector3(0, 1, 0),
    rotation: new THREE.Vector3(0, 0, 0),
  },
  [CubeRotationDirection.Bottom]: {
    position: new THREE.Vector3(0, -1, 0),
    rotation: new THREE.Vector3(0, 0, Math.PI),
  },
  [CubeRotationDirection.Right]: {
    position: new THREE.Vector3(1, 0, 0),
    rotation: new THREE.Vector3(0, 0, -Math.PI * 0.5),
  },
  [CubeRotationDirection.Left]: {
    position: new THREE.Vector3(-1, 0, 0),
    rotation: new THREE.Vector3(0, 0, Math.PI * 0.5),
  }
}

const GridRotationConfig: { [key in CubeSide]: THREE.Vector3 } = {
  [CubeSide.Front]: new THREE.Vector3(0, 0, 0),
  [CubeSide.Back]: new THREE.Vector3(0, Math.PI, 0),
  [CubeSide.Left]: new THREE.Vector3(0, Math.PI * 0.5, 0),
  [CubeSide.Right]: new THREE.Vector3(0, -Math.PI * 0.5, 0),
  [CubeSide.Top]: new THREE.Vector3(-Math.PI * 0.5, 0, 0),
  [CubeSide.Bottom]: new THREE.Vector3(Math.PI * 0.5, 0, 0),
};

const TextAxisOnCubeSide: { [key in CubeSide]: string } = {
  [CubeSide.Front]: 'y',
  [CubeSide.Back]: 'y',
  [CubeSide.Left]: 'y',
  [CubeSide.Right]: 'y',
  [CubeSide.Top]: 'z',
  [CubeSide.Bottom]: 'z',
};

export {
  CubeSideName,
  CubeEdgeName,
  CubeEdgeNameVectorsConfig,
  GridRotationConfig,
  TextAxisOnCubeSide,
};
