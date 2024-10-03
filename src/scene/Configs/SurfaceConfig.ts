import * as THREE from 'three';
import { CubeSide } from '../Enums/CubeSide';
import { ICubeSurfaceAxisConfig } from '../Interfaces/ICubeConfig';
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';

const SurfaceVectorConfig: { [key in CubeSide]: THREE.Vector3 } = {
  [CubeSide.Front]: new THREE.Vector3(0, 0, 1),
  [CubeSide.Right]: new THREE.Vector3(1, 0, 0),
  [CubeSide.Left]: new THREE.Vector3(-1, 0, 0),
  [CubeSide.Top]: new THREE.Vector3(0, 1, 0),
  [CubeSide.Bottom]: new THREE.Vector3(0, -1, 0),
  [CubeSide.Back]: new THREE.Vector3(0, 0, -1),
};

const CubeSurfaceAxisConfig: ICubeSurfaceAxisConfig[] = [
  { side: CubeSide.Front, configIndex: 0, xAxis: 'x', yAxis: 'y', zAxis: 'z', xFactor: 1, yFactor: -1 },
  { side: CubeSide.Left, configIndex: 2, xAxis: 'z', yAxis: 'y', zAxis: 'x', xFactor: 1, yFactor: -1 },
  { side: CubeSide.Right, configIndex: 1, xAxis: 'z', yAxis: 'y', zAxis: 'x', xFactor: -1, yFactor: -1 },
  { side: CubeSide.Top, configIndex: 3, xAxis: 'x', yAxis: 'z', zAxis: 'y', xFactor: 1, yFactor: 1 },
  { side: CubeSide.Bottom, configIndex: 4, xAxis: 'x', yAxis: 'z', zAxis: 'y', xFactor: 1, yFactor: -1 },
  { side: CubeSide.Back, configIndex: 5, xAxis: 'x', yAxis: 'y', zAxis: 'z', xFactor: -1, yFactor: -1 },
];

const CharacterSurfaceConfig = {
  [CubeSide.Front]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: 1, x: x, y: y, z: null }},
  [CubeSide.Left]: (x: number, y: number) => { return { xFactor: -1, yFactor: -1, zFactor: 1, x: null, y: y, z: x }},
  [CubeSide.Right]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: -1, x: null, y: y, z: x }},
  [CubeSide.Top]: (x: number, y: number) => { return { xFactor: 1, yFactor: 1, zFactor: 1, x: x, y: null, z: y }},
  [CubeSide.Bottom]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: -1, x: x, y: null, z: y }},
  [CubeSide.Back]: (x: number, y: number) => { return { xFactor: -1, yFactor: -1, zFactor: -1, x: x, y: y, z: null }},
}

const SideVectorConfig: { [key in CubeSide]: THREE.Vector3} = {
  [CubeSide.Front]: new THREE.Vector3(0, 0, 1),
  [CubeSide.Right]: new THREE.Vector3(1, 0, 0),
  [CubeSide.Left]: new THREE.Vector3(-1, 0, 0),
  [CubeSide.Top]: new THREE.Vector3(0, 1, 0),
  [CubeSide.Bottom]: new THREE.Vector3(0, -1, 0),
  [CubeSide.Back]: new THREE.Vector3(0, 0, -1),
};

const LocalEdgeDirections = {
  [CubeSide.Front]: {
    [CubeRotationDirection.Top]: new THREE.Vector3(0, 1, 0),
    [CubeRotationDirection.Right]: new THREE.Vector3(1, 0, 0),
    [CubeRotationDirection.Bottom]: new THREE.Vector3(0, -1, 0),
    [CubeRotationDirection.Left]: new THREE.Vector3(-1, 0, 0),
  },
  [CubeSide.Back]: {
    [CubeRotationDirection.Top]: new THREE.Vector3(0, 1, 0),
    [CubeRotationDirection.Right]: new THREE.Vector3(-1, 0, 0),
    [CubeRotationDirection.Bottom]: new THREE.Vector3(0, -1, 0),
    [CubeRotationDirection.Left]: new THREE.Vector3(1, 0, 0),
  },
  [CubeSide.Left]: {
    [CubeRotationDirection.Top]: new THREE.Vector3(0, 1, 0),
    [CubeRotationDirection.Right]: new THREE.Vector3(0, 0, 1),
    [CubeRotationDirection.Bottom]: new THREE.Vector3(0, -1, 0),
    [CubeRotationDirection.Left]: new THREE.Vector3(0, 0, -1),
  },
  [CubeSide.Right]: {
    [CubeRotationDirection.Top]: new THREE.Vector3(0, 1, 0),
    [CubeRotationDirection.Right]: new THREE.Vector3(0, 0, -1),
    [CubeRotationDirection.Bottom]: new THREE.Vector3(0, -1, 0),
    [CubeRotationDirection.Left]: new THREE.Vector3(0, 0, 1),
  },
  [CubeSide.Top]: {
    [CubeRotationDirection.Top]: new THREE.Vector3(0, 0, -1),
    [CubeRotationDirection.Right]: new THREE.Vector3(1, 0, 0),
    [CubeRotationDirection.Bottom]: new THREE.Vector3(0, 0, 1),
    [CubeRotationDirection.Left]: new THREE.Vector3(-1, 0, 0),
  },
  [CubeSide.Bottom]: {
    [CubeRotationDirection.Top]: new THREE.Vector3(0, 0, 1),
    [CubeRotationDirection.Right]: new THREE.Vector3(1, 0, 0),
    [CubeRotationDirection.Bottom]: new THREE.Vector3(0, 0, -1),
    [CubeRotationDirection.Left]: new THREE.Vector3(-1, 0, 0),
  },
}

export { SurfaceVectorConfig, CubeSurfaceAxisConfig, CharacterSurfaceConfig, SideVectorConfig, LocalEdgeDirections };
