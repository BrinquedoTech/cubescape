import * as THREE from 'three';
import { CubeEdge } from '../Enums/CubeEdge';
import { IEdgeAxisConfig, IEdgeBySideConfig } from '../Interfaces/ICubeConfig';
import { CubeSide } from '../Enums/CubeSide';
import { CubeEdgeOnSidePositionType } from '../Enums/CubeEdgeOnSide';

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

const EdgesBySideArrayConfig: { [key in CubeSide]: CubeEdge[] } = {
  [CubeSide.Front]: [CubeEdge.FrontTop, CubeEdge.FrontDown, CubeEdge.FrontLeft, CubeEdge.FrontRight],
  [CubeSide.Left]: [CubeEdge.FrontLeft, CubeEdge.TopLeft, CubeEdge.DownLeft, CubeEdge.BackLeft],
  [CubeSide.Right]: [CubeEdge.FrontRight, CubeEdge.TopRight, CubeEdge.DownRight, CubeEdge.BackRight],
  [CubeSide.Top]: [CubeEdge.FrontTop, CubeEdge.TopLeft, CubeEdge.TopRight, CubeEdge.BackTop],
  [CubeSide.Bottom]: [CubeEdge.FrontDown, CubeEdge.DownLeft, CubeEdge.DownRight, CubeEdge.BackDown],
  [CubeSide.Back]: [CubeEdge.BackTop, CubeEdge.BackDown, CubeEdge.BackLeft, CubeEdge.BackRight],
}

const EdgeBySideConfig: IEdgeBySideConfig = {
  [CubeSide.Front]: {
    [CubeEdge.FrontTop]: { positionType: CubeEdgeOnSidePositionType.Top, direction: 1 },
    [CubeEdge.FrontDown]: { positionType: CubeEdgeOnSidePositionType.Down, direction: 1 },
    [CubeEdge.FrontLeft]: { positionType: CubeEdgeOnSidePositionType.Left, direction: -1 },
    [CubeEdge.FrontRight]: { positionType: CubeEdgeOnSidePositionType.Right, direction: -1 },
  },
  [CubeSide.Left]: {
    [CubeEdge.FrontLeft]: { positionType: CubeEdgeOnSidePositionType.Right, direction: -1 },
    [CubeEdge.TopLeft]: { positionType: CubeEdgeOnSidePositionType.Top, direction: 1 },
    [CubeEdge.DownLeft]: { positionType: CubeEdgeOnSidePositionType.Down, direction: 1 },
    [CubeEdge.BackLeft]: { positionType: CubeEdgeOnSidePositionType.Left, direction: -1 },
  },
  [CubeSide.Right]: {
    [CubeEdge.FrontRight]: { positionType: CubeEdgeOnSidePositionType.Left, direction: -1 },
    [CubeEdge.TopRight]: { positionType: CubeEdgeOnSidePositionType.Top, direction: -1 },
    [CubeEdge.DownRight]: { positionType: CubeEdgeOnSidePositionType.Down, direction: -1 },
    [CubeEdge.BackRight]: { positionType: CubeEdgeOnSidePositionType.Right, direction: -1 },
  },
  [CubeSide.Top]: {
    [CubeEdge.FrontTop]: { positionType: CubeEdgeOnSidePositionType.Down, direction: 1 },
    [CubeEdge.TopLeft]: { positionType: CubeEdgeOnSidePositionType.Left, direction: 1 },
    [CubeEdge.TopRight]: { positionType: CubeEdgeOnSidePositionType.Right, direction: 1 },
    [CubeEdge.BackTop]: { positionType: CubeEdgeOnSidePositionType.Top, direction: 1 },
  },
  [CubeSide.Bottom]: {
    [CubeEdge.FrontDown]: { positionType: CubeEdgeOnSidePositionType.Top, direction: 1 },
    [CubeEdge.DownLeft]: { positionType: CubeEdgeOnSidePositionType.Left, direction: -1 },
    [CubeEdge.DownRight]: { positionType: CubeEdgeOnSidePositionType.Right, direction: -1 },
    [CubeEdge.BackDown]: { positionType: CubeEdgeOnSidePositionType.Down, direction: 1 },
  },
  [CubeSide.Back]: {
    [CubeEdge.BackTop]: { positionType: CubeEdgeOnSidePositionType.Top, direction: -1 },
    [CubeEdge.BackDown]: { positionType: CubeEdgeOnSidePositionType.Down, direction: -1 },
    [CubeEdge.BackLeft]: { positionType: CubeEdgeOnSidePositionType.Right, direction: -1 },
    [CubeEdge.BackRight]: { positionType: CubeEdgeOnSidePositionType.Left, direction: -1 },
  },
}

export { EdgeDistanceConfig, EdgeAxisConfig, EdgesBySideArrayConfig, EdgeBySideConfig };
