import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";

// Empty = ' ',
// Wall = 'W',
// Start = 'S',
// Finish = 'F',

const Level02: ILevelConfig = {
  size: new THREE.Vector3(5, 6, 7),
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        [' ', ' ', ' ', ' ', 'F'],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', 'S', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: ['W', 'W', 'W', 'W', ' '], // sizeX
      [CubeEdge.FrontDown]: [' ', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.FrontLeft]: ['W', 'W', 'W', 'W', 'W', ' '], // sizeY
      [CubeEdge.FrontRight]: [' ', 'W', 'W', 'W', 'W', 'W'], // sizeY
      [CubeEdge.TopLeft]: ['W', 'W', 'W', 'W', 'W', 'W', ' '], // sizeZ
      [CubeEdge.TopRight]: ['W', 'W', 'W', 'W', 'W', 'W', ' '], // sizeZ
      [CubeEdge.DownLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.DownRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.BackTop]: [' ', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.BackDown]: ['W', 'W', 'W', 'W', ' '], // sizeX
      [CubeEdge.BackLeft]: [' ', 'W', 'W', 'W', 'W', 'W'], // sizeY
      [CubeEdge.BackRight]: ['W', 'W', 'W', 'W', 'W', ' '], // sizeY
    },
  },
};

export default Level02;