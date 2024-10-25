import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";

// Empty = ' ',
// Wall = 'W',
// Start = 'S',
// Finish = 'F',

const Level01: ILevelConfig = {
  size: new THREE.Vector3(7, 7, 7),
  map: {
    sides: {
      [CubeSide.Front]: [
        ['  ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', 'W', 'W', 'W', ' '],
        [' ', 'W', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', ' ', ' ', 'W', ' ', ' '],
        [' ', 'W', ' ', ' ', 'W', ' ', ' '],
        [' ', 'W', 'W', ' ', 'W', ' ', ' '],
        ['S', 'W', 'W', ' ', 'W', ' ', ' '],
      ],
      [CubeSide.Left]: [
        [' ', ' ', ' ', ' ', ' ', 'W', 'W'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'W', ' ', ' ', ' '],
        ['W', 'W', ' ', 'W', 'W', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['W', 'W', ' ', ' ', ' ', ' ', 'W'],
        ['W', 'W', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Right]: [
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        [' ', 'W', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', ' ', 'W', ' ', 'W', 'W'],
        [' ', 'W', ' ', 'W', ' ', 'W', 'W'],
        [' ', 'W', ' ', ' ', ' ', 'W', 'W'],
      ],
      [CubeSide.Top]: [
        [' ', 'W', 'W', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', ' ', ' ', 'W', 'W'],
        [' ', ' ', ' ', ' ', ' ', 'W', ' '],
        ['W', 'W', 'W', 'W', 'W', 'W', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', 'W', 'W', 'W', 'W'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Bottom]: [
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', ' ', 'W', 'W', 'W'],
        [' ', ' ', 'W', ' ', 'W', ' ', ' '],
        [' ', ' ', 'W', ' ', 'W', ' ', ' '],
        ['W', ' ', 'W', ' ', 'W', ' ', ' '],
        [' ', ' ', 'W', ' ', 'W', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Back]: [
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', 'W', 'W', ' ', 'W', 'W', ' '],
        [' ', 'W', ' ', ' ', ' ', 'W', ' '],
        [' ', 'W', ' ', 'F', ' ', 'W', ' '],
        [' ', 'W', 'W', ' ', ' ', 'W', ' '],
        [' ', 'W', 'W', ' ', ' ', 'W', ' '],
        [' ', ' ', ' ', ' ', ' ', 'W', ' '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.FrontDown]: ['W', 'W', 'W', ' ', 'W', 'W', 'W'],
      [CubeEdge.FrontLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.FrontRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.TopLeft]: [' ', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.TopRight]: [' ', 'W', ' ', 'W', 'W', 'W', ' '],
      [CubeEdge.DownLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.DownRight]: ['W', 'W', 'W', 'W', 'W', 'W', ' '],
      [CubeEdge.BackTop]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackDown]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackLeft]: ['W', 'W', ' ', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
    },
  },
};

export default Level01;
