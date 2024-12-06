import * as THREE from 'three';
import { CubeEdge } from '../../Enums/Cube/CubeEdge';
import { IEdgeConfig, IEdgeBySideConfig, IEdgeWallsRotation } from '../../Interfaces/ICubeConfig';
import { CubeSide } from '../../Enums/Cube/CubeSide';
import { CubeEdgeOnSidePositionType } from '../../Enums/Cube/CubeEdgeOnSide';
import { ICellModelConfig, IGeometryRotationConfig } from '../../Interfaces/ICellConfig';

const EdgeModelsConfig: ICellModelConfig = {
  probabilities: [0.94, 0.03, 0.03, 0.03],
  models: ['edge_01', 'edge_02', 'edge_03', 'edge_04'],
}

const EdgeWallModelsConfig: ICellModelConfig = {
  probabilities: [1],
  models: ['edge_wall_01'],
}

const EdgeWallCellGeometryConfig: IGeometryRotationConfig = {
  rotation: new THREE.Euler(0, 0, 0),
}

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

const EdgeRotationConfig: IEdgeConfig[] = [
  { edge: CubeEdge.FrontTop, axis: 'x', rotation: new THREE.Euler(0, 0, 0) },
  { edge: CubeEdge.FrontDown, axis: 'x', rotation: new THREE.Euler(Math.PI * 0.5, 0, 0) },
  { edge: CubeEdge.FrontLeft, axis: 'y', rotation: new THREE.Euler(0, 0, Math.PI * 0.5) },
  { edge: CubeEdge.FrontRight, axis: 'y', rotation: new THREE.Euler(0, 0, -Math.PI * 0.5) },
  { edge: CubeEdge.TopLeft, axis: 'z', rotation: new THREE.Euler(0, -Math.PI * 0.5, 0) },
  { edge: CubeEdge.TopRight, axis: 'z', rotation: new THREE.Euler(0, Math.PI * 0.5, 0) },
  { edge: CubeEdge.DownLeft, axis: 'z', rotation: new THREE.Euler(0, -Math.PI * 0.5, Math.PI) },
  { edge: CubeEdge.DownRight, axis: 'z', rotation: new THREE.Euler(0, Math.PI * 0.5, Math.PI) },
  { edge: CubeEdge.BackTop, axis: 'x', rotation: new THREE.Euler(0, Math.PI, 0) },
  { edge: CubeEdge.BackDown, axis: 'x', rotation: new THREE.Euler(0, Math.PI, Math.PI) },
  { edge: CubeEdge.BackLeft, axis: 'y', rotation: new THREE.Euler(0, -Math.PI * 0.5, Math.PI * 0.5) },
  { edge: CubeEdge.BackRight, axis: 'y', rotation: new THREE.Euler(0, Math.PI * 0.5, -Math.PI * 0.5) },
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

const CubeSideByEdge: { [key in CubeEdge]: CubeSide } = {
  [CubeEdge.FrontTop]: CubeSide.Front,
  [CubeEdge.FrontDown]: CubeSide.Front,
  [CubeEdge.FrontLeft]: CubeSide.Front,
  [CubeEdge.FrontRight]: CubeSide.Front,
  [CubeEdge.TopLeft]: CubeSide.Top,
  [CubeEdge.TopRight]: CubeSide.Top,
  [CubeEdge.DownLeft]: CubeSide.Bottom,
  [CubeEdge.DownRight]: CubeSide.Bottom,
  [CubeEdge.BackTop]: CubeSide.Back,
  [CubeEdge.BackDown]: CubeSide.Back,
  [CubeEdge.BackLeft]: CubeSide.Back,
  [CubeEdge.BackRight]: CubeSide.Back,
}

const EdgeWallsRotation: { [key in CubeEdge]: IEdgeWallsRotation } = {
  [CubeEdge.FrontTop]: { axis: new THREE.Vector3(1, 0, 0), leftRotation: -Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.FrontDown]: { axis: new THREE.Vector3(1, 0, 0), leftRotation: Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.FrontLeft]: { axis: new THREE.Vector3(0, 1, 0), leftRotation: -Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.FrontRight]: { axis: new THREE.Vector3(0, 1, 0), leftRotation: Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.TopLeft]: { axis: new THREE.Vector3(0, 0, 1), leftRotation: Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.TopRight]: { axis: new THREE.Vector3(0, 0, 1), leftRotation: -Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.DownLeft]: { axis: new THREE.Vector3(0, 0, 1), leftRotation: -Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.DownRight]: { axis: new THREE.Vector3(0, 0, 1), leftRotation: Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.BackTop]: { axis: new THREE.Vector3(1, 0, 0), leftRotation: Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.BackDown]: { axis: new THREE.Vector3(1, 0, 0), leftRotation: -Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.BackLeft]: { axis: new THREE.Vector3(0, 1, 0), leftRotation: Math.PI * 0.5, rightRotation: 0 },
  [CubeEdge.BackRight]: { axis: new THREE.Vector3(0, 1, 0), leftRotation: -Math.PI * 0.5, rightRotation: 0 },
}

const EdgeDirectionForwardConfig: { [key in CubeEdge]: boolean } = {
    [CubeEdge.FrontTop]: true,
    [CubeEdge.FrontDown]: true,
    [CubeEdge.FrontLeft]: true,
    [CubeEdge.FrontRight]: false,
    [CubeEdge.TopLeft]: true,
    [CubeEdge.TopRight]: false,
    [CubeEdge.DownLeft]: false,
    [CubeEdge.DownRight]: true,
    [CubeEdge.BackTop]: false,
    [CubeEdge.BackDown]: true,
    [CubeEdge.BackLeft]: true,
    [CubeEdge.BackRight]: false,
}

export {
  EdgeDistanceConfig,
  EdgeRotationConfig,
  EdgesBySideArrayConfig,
  EdgeBySideConfig,
  EdgeModelsConfig,
  CubeSideByEdge,
  EdgeWallsRotation,
  EdgeWallModelsConfig,
  EdgeWallCellGeometryConfig,
  EdgeDirectionForwardConfig,
};
