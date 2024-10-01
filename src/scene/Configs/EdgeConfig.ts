import * as THREE from 'three';
import { CubeEdge } from '../Enums/CubeEdge';
import { IEdgeAxisConfig } from '../Interfaces/ICubeConfig';

const EdgeDistanceConfig: THREE.Vector3[] = [
  new THREE.Vector3(0, 1, 1), // FrontTop
  new THREE.Vector3(0, -1, 1), // FrontDown
  new THREE.Vector3(-1, 0, 1), // FrontLeft
  new THREE.Vector3(1, 0, 1), // FrontRight
  new THREE.Vector3(-1, 1, 0), // TopLeft
  new THREE.Vector3(1, 1, 0), // TopRight
  new THREE.Vector3(-1, -1, 0), // DownLeft
  new THREE.Vector3(1, -1, 0), // DownRight
  new THREE.Vector3(0, 1, -1), // BackTop
  new THREE.Vector3(0, -1, -1), // BackDown
  new THREE.Vector3(-1, 0, -1), // BackLeft
  new THREE.Vector3(1, 0, -1), // BackRight
];

const EdgeAxisConfig: IEdgeAxisConfig[] = [
  { edge: CubeEdge.FrontTop, axis: 'x' },
  { edge: CubeEdge.FrontDown, axis: 'x' },
  { edge: CubeEdge.FrontLeft, axis: 'y' },
  { edge: CubeEdge.FrontRight, axis: 'y' },
  { edge: CubeEdge.TopLeft, axis: 'z' },
  { edge: CubeEdge.TopRight, axis: 'z' },
  { edge: CubeEdge.DownLeft, axis: 'z' },
  { edge: CubeEdge.DownRight, axis: 'z' },
  { edge: CubeEdge.BackTop, axis: 'x' },
  { edge: CubeEdge.BackDown, axis: 'x' },
  { edge: CubeEdge.BackLeft, axis: 'y' },
  { edge: CubeEdge.BackRight, axis: 'y' },
];

export { EdgeDistanceConfig, EdgeAxisConfig };
