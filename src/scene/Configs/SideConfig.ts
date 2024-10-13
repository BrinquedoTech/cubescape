import * as THREE from 'three';
import { CubeSide } from '../Enums/CubeSide';
import { ICharacterSideConfig, ICubeSideAxisConfig, ILocalEdgeDirections } from '../Interfaces/ICubeConfig';
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';

const SideRotationConfig: { [key in CubeSide]: THREE.Vector3 } = {
  [CubeSide.Front]: new THREE.Vector3(0, 0, 0),
  [CubeSide.Back]: new THREE.Vector3(0, Math.PI, 0),
  [CubeSide.Left]: new THREE.Vector3(0, -Math.PI * 0.5, 0),
  [CubeSide.Right]: new THREE.Vector3(0, Math.PI * 0.5, 0),
  [CubeSide.Top]: new THREE.Vector3(-Math.PI * 0.5, 0, 0),
  [CubeSide.Bottom]: new THREE.Vector3(Math.PI * 0.5, 0, 0),
}

const SideVectorConfig: { [key in CubeSide]: THREE.Vector3 } = {
  [CubeSide.Front]: new THREE.Vector3(0, 0, 1),
  [CubeSide.Right]: new THREE.Vector3(1, 0, 0),
  [CubeSide.Left]: new THREE.Vector3(-1, 0, 0),
  [CubeSide.Top]: new THREE.Vector3(0, 1, 0),
  [CubeSide.Bottom]: new THREE.Vector3(0, -1, 0),
  [CubeSide.Back]: new THREE.Vector3(0, 0, -1),
}

const CubeSideAxisConfig: { [key in CubeSide]: ICubeSideAxisConfig } = {
  [CubeSide.Front]: { xAxis: 'x', yAxis: 'y', zAxis: 'z', xFactor: 1, yFactor: -1 },
  [CubeSide.Left]: { xAxis: 'z', yAxis: 'y', zAxis: 'x', xFactor: 1, yFactor: -1 },
  [CubeSide.Right]: { xAxis: 'z', yAxis: 'y', zAxis: 'x', xFactor: -1, yFactor: -1 },
  [CubeSide.Top]: { xAxis: 'x', yAxis: 'z', zAxis: 'y', xFactor: 1, yFactor: 1 },
  [CubeSide.Bottom]: { xAxis: 'x', yAxis: 'z', zAxis: 'y', xFactor: 1, yFactor: -1 },
  [CubeSide.Back]: { xAxis: 'x', yAxis: 'y', zAxis: 'z', xFactor: -1, yFactor: -1 },
}

const CharacterSideConfig: { [key in CubeSide]: (x: number, y: number) => ICharacterSideConfig } = {
  [CubeSide.Front]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: 1, x: x, y: y, z: null }},
  [CubeSide.Left]: (x: number, y: number) => { return { xFactor: -1, yFactor: -1, zFactor: 1, x: null, y: y, z: x }},
  [CubeSide.Right]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: -1, x: null, y: y, z: x }},
  [CubeSide.Top]: (x: number, y: number) => { return { xFactor: 1, yFactor: 1, zFactor: 1, x: x, y: null, z: y }},
  [CubeSide.Bottom]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: -1, x: x, y: null, z: y }},
  [CubeSide.Back]: (x: number, y: number) => { return { xFactor: -1, yFactor: -1, zFactor: -1, x: x, y: y, z: null }},
}

const LocalEdgeDirections: ILocalEdgeDirections = {
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

export {
  CubeSideAxisConfig,
  CharacterSideConfig,
  SideVectorConfig,
  LocalEdgeDirections,
  SideRotationConfig,
};
