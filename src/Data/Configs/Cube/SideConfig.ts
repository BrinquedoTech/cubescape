import * as THREE from 'three';
import { CubeSide } from '../../Enums/Cube/CubeSide';
import { ICharacterSideConfig, ICubeSideAxisConfig, ILocalEdgeDirections } from '../../Interfaces/ICubeConfig';
import { CubeRotationDirection } from '../../Enums/Cube/CubeRotationDirection';
import { Direction } from '../../Enums/Direction';

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
  [CubeSide.Front]: { xAxis: 'x', yAxis: 'y', zAxis: 'z', xFactor: 1, yFactor: -1, zFactor: 1 },
  [CubeSide.Left]: { xAxis: 'z', yAxis: 'y', zAxis: 'x', xFactor: 1, yFactor: -1, zFactor: -1 },
  [CubeSide.Right]: { xAxis: 'z', yAxis: 'y', zAxis: 'x', xFactor: -1, yFactor: -1, zFactor: 1 },
  [CubeSide.Top]: { xAxis: 'x', yAxis: 'z', zAxis: 'y', xFactor: 1, yFactor: 1, zFactor: 1 },
  [CubeSide.Bottom]: { xAxis: 'x', yAxis: 'z', zAxis: 'y', xFactor: 1, yFactor: -1, zFactor: -1 },
  [CubeSide.Back]: { xAxis: 'x', yAxis: 'y', zAxis: 'z', xFactor: -1, yFactor: -1, zFactor: -1 },
}

const CharacterSideConfig: { [key in CubeSide]: (x: number, y: number) => ICharacterSideConfig } = {
  [CubeSide.Front]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: 1, x: x, y: y, z: null }},
  [CubeSide.Left]: (x: number, y: number) => { return { xFactor: -1, yFactor: -1, zFactor: 1, x: null, y: y, z: x }},
  [CubeSide.Right]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: -1, x: null, y: y, z: x }},
  [CubeSide.Top]: (x: number, y: number) => { return { xFactor: 1, yFactor: 1, zFactor: 1, x: x, y: null, z: y }},
  [CubeSide.Bottom]: (x: number, y: number) => { return { xFactor: 1, yFactor: -1, zFactor: -1, x: x, y: null, z: y }},
  [CubeSide.Back]: (x: number, y: number) => { return { xFactor: -1, yFactor: -1, zFactor: -1, x: x, y: y, z: null }},
}

const AxisByRotationDirection: { [key in CubeRotationDirection]: (x: number, y: number) => { x: number, y: number } } = {
  [CubeRotationDirection.Top]: (x: number, y: number) => { return { x: x, y: y } },
  [CubeRotationDirection.Right]: (x: number, y: number) => { return { x: y, y: -x } },
  [CubeRotationDirection.Bottom]: (x: number, y: number) => { return { x: -x, y: -y } },
  [CubeRotationDirection.Left]: (x: number, y: number) => { return { x: -y, y: x } },
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

const ObjectsRotationBySideConfig: { [key in CubeSide]: THREE.Euler } = {
  [CubeSide.Front]: new THREE.Euler(0, 0, 0),
  [CubeSide.Back]: new THREE.Euler(0, Math.PI, 0),
  [CubeSide.Left]: new THREE.Euler(0, -Math.PI / 2, 0),
  [CubeSide.Right]: new THREE.Euler(0, Math.PI / 2, 0),
  [CubeSide.Top]: new THREE.Euler(-Math.PI / 2, 0, 0),
  [CubeSide.Bottom]: new THREE.Euler(Math.PI / 2, 0, 0),
}

const CellDirectionConfig: { [key in Direction]: { position: THREE.Vector3, rotation: THREE.Vector3 } } = {
  [Direction.Up]: {
    position: new THREE.Vector3(0, 1, 0),
    rotation: new THREE.Vector3(0, 0, 0),
  },
  [Direction.Down]: {
    position: new THREE.Vector3(0, -1, 0),
    rotation: new THREE.Vector3(0, 0, Math.PI),
  },
  [Direction.Right]: {
    position: new THREE.Vector3(1, 0, 0),
    rotation: new THREE.Vector3(0, 0, -Math.PI * 0.5),
  },
  [Direction.Left]: {
    position: new THREE.Vector3(-1, 0, 0),
    rotation: new THREE.Vector3(0, 0, Math.PI * 0.5),
  }
}

const Direction2DVectorConfig: { [key in Direction]: THREE.Vector2 } = {
  [Direction.Up]: new THREE.Vector2(0, -1),
  [Direction.Down]: new THREE.Vector2(0, 1),
  [Direction.Left]: new THREE.Vector2(-1, 0),
  [Direction.Right]: new THREE.Vector2(1, 0),
}

const NeighboringSidesConfig: { [key in CubeSide]: CubeSide[] } = {
  [CubeSide.Front]: [CubeSide.Left, CubeSide.Right, CubeSide.Top, CubeSide.Bottom],
  [CubeSide.Left]: [CubeSide.Front, CubeSide.Back, CubeSide.Top, CubeSide.Bottom],
  [CubeSide.Right]: [CubeSide.Front, CubeSide.Back, CubeSide.Top, CubeSide.Bottom],
  [CubeSide.Top]: [CubeSide.Front, CubeSide.Back, CubeSide.Left, CubeSide.Right],
  [CubeSide.Bottom]: [CubeSide.Front, CubeSide.Back, CubeSide.Left, CubeSide.Right],
  [CubeSide.Back]: [CubeSide.Left, CubeSide.Right, CubeSide.Top, CubeSide.Bottom],
}

const OppositeSideConfig: { [key in CubeSide]: CubeSide } = {
  [CubeSide.Front]: CubeSide.Back,
  [CubeSide.Back]: CubeSide.Front,
  [CubeSide.Left]: CubeSide.Right,
  [CubeSide.Right]: CubeSide.Left,
  [CubeSide.Top]: CubeSide.Bottom,
  [CubeSide.Bottom]: CubeSide.Top,
}

export {
  CubeSideAxisConfig,
  CharacterSideConfig,
  SideVectorConfig,
  LocalEdgeDirections,
  SideRotationConfig,
  ObjectsRotationBySideConfig,
  CellDirectionConfig,
  Direction2DVectorConfig,
  NeighboringSidesConfig,
  OppositeSideConfig,
  AxisByRotationDirection,
};
