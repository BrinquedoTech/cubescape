import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";

// Empty = 0,
// Wall = 1,
// Start = 2,
// Finish = 3,

const Level01: ILevelConfig = {
  size: new THREE.Vector3(7, 7, 7),
  map: {
    surfaces: {
      [CubeSide.Front]: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 2],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1],
      ],
      [CubeSide.Left]: [
        [1, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0],
      ],
      [CubeSide.Right]: [
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
      [CubeSide.Top]: [
        [0, 0, 0, 1, 0, 0, 0],
        [1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1],
      ],
      [CubeSide.Bottom]: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
      [CubeSide.Back]: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: [0, 1, 1, 1, 1, 1, 1],
      [CubeEdge.FrontDown]: [1, 0, 1, 1, 1, 1, 1],
      [CubeEdge.FrontLeft]: [0, 1, 1, 1, 1, 1, 0],
      [CubeEdge.FrontRight]: [1, 0, 1, 1, 1, 1, 1],
      [CubeEdge.TopLeft]: [1, 1, 0, 1, 1, 1, 1],
      [CubeEdge.TopRight]: [1, 1, 1, 1, 1, 0, 1],
      [CubeEdge.DownLeft]: [1, 1, 1, 1, 1, 1, 1],
      [CubeEdge.DownRight]: [1, 1, 1, 1, 1, 1, 1],
      [CubeEdge.BackTop]: [1, 1, 0, 1, 1, 1, 1],
      [CubeEdge.BackDown]: [0, 1, 1, 1, 1, 1, 1],
      [CubeEdge.BackLeft]: [1, 1, 1, 1, 1, 1, 1],
      [CubeEdge.BackRight]: [0, 1, 1, 1, 1, 1, 1],
    },
  },
};

export default Level01;
