import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { CubeRotationDirection } from '../../Enums/CubeRotationDirection';

// Empty = 0,
// Wall = 1,
// Start = 2,
// Finish = 3,

const Level02: ILevelConfig = {
  size: new THREE.Vector3(5, 6, 7),
  startSide: {
    side: CubeSide.Front,
    rotationDirection: CubeRotationDirection.Top,
  },
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 2, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: [1, 1, 1, 1, 0], // sizeX
      [CubeEdge.FrontDown]: [0, 1, 1, 1, 1], // sizeX
      [CubeEdge.FrontLeft]: [1, 1, 1, 1, 1, 0], // sizeY
      [CubeEdge.FrontRight]: [0, 1, 1, 1, 1, 1], // sizeY
      [CubeEdge.TopLeft]: [1, 1, 1, 1, 1, 1, 0], // sizeZ
      [CubeEdge.TopRight]: [1, 1, 1, 1, 1, 1, 0], // sizeZ
      [CubeEdge.DownLeft]: [1, 1, 1, 1, 1, 1, 1], // sizeZ
      [CubeEdge.DownRight]: [1, 1, 1, 1, 1, 1, 1], // sizeZ
      [CubeEdge.BackTop]: [0, 1, 1, 1, 1], // sizeX
      [CubeEdge.BackDown]: [1, 1, 1, 1, 0], // sizeX
      [CubeEdge.BackLeft]: [0, 1, 1, 1, 1, 1], // sizeY
      [CubeEdge.BackRight]: [1, 1, 1, 1, 1, 0], // sizeY
    },
  },
};

export default Level02;