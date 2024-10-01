import * as THREE from 'three';
import { CubeSide } from '../Enums/CubeSide';
import { ICubeSurfaceAxisConfig } from '../Interfaces/ICubeConfig';

const SurfaceDistanceConfig: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 1), // Front
  new THREE.Vector3(1, 0, 0), // Right
  new THREE.Vector3(-1, 0, 0), // Left
  new THREE.Vector3(0, 1, 0), // Top
  new THREE.Vector3(0, -1, 0), // Down
  new THREE.Vector3(0, 0, -1), // Back
];

const CubeSurfaceAxisConfig: ICubeSurfaceAxisConfig[] = [
  { side: CubeSide.Front, configIndex: 0, xAxis: 'x', yAxis: 'y', zAxis: 'z', xFactor: 1, yFactor: -1 },
  { side: CubeSide.Left, configIndex: 2, xAxis: 'z', yAxis: 'y', zAxis: 'x', xFactor: 1, yFactor: -1 },
  { side: CubeSide.Right, configIndex: 1, xAxis: 'z', yAxis: 'y', zAxis: 'x', xFactor: -1, yFactor: -1 },
  { side: CubeSide.Top, configIndex: 3, xAxis: 'x', yAxis: 'z', zAxis: 'y', xFactor: 1, yFactor: 1 },
  { side: CubeSide.Down, configIndex: 4, xAxis: 'x', yAxis: 'z', zAxis: 'y', xFactor: 1, yFactor: -1 },
  { side: CubeSide.Back, configIndex: 5, xAxis: 'x', yAxis: 'y', zAxis: 'z', xFactor: -1, yFactor: -1 },
];

const CharacterSurfaceConfig = {
  [CubeSide.Front]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: 1, x: x, y: y, z: null }},
  [CubeSide.Left]: (x: number, y: number) => { return { xFactor: -1, yFactor: -1, zFactor: 1, x: null, y: y, z: x }},
  [CubeSide.Right]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: -1, x: null, y: y, z: x }},
  [CubeSide.Top]: (x: number, y: number) => { return { xFactor: 1, yFactor: 1, zFactor: 1, x: x, y: null, z: y }},
  [CubeSide.Down]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: -1, x: x, y: null, z: y }},
  [CubeSide.Back]: (x: number, y: number) => { return { xFactor: -1, yFactor: -1, zFactor: -1, x: x, y: y, z: null }},
}

export { SurfaceDistanceConfig, CubeSurfaceAxisConfig, CharacterSurfaceConfig };
