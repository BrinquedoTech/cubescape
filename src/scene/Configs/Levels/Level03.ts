import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";

// Empty = ' ',
// Wall = 'W',
// Start = 'S',
// Finish = 'F',

const Level03: ILevelConfig = {
  size: new THREE.Vector3(2, 2, 2),
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        ['S', ' '],
        [' ', ' '],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        [' ', ' '],
        [' ', ' '],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        [' ', ' '],
        [' ', ' '],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        [' ', 'F'],
        [' ', ' '],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        [' ', ' '],
        [' ', ' '],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        [' ', ' '],
        [' ', ' '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: ['W', ' '], // sizeX
      [CubeEdge.FrontDown]: ['W', 'W'], // sizeX
      [CubeEdge.FrontLeft]: ['W', 'W'], // sizeY
      [CubeEdge.FrontRight]: ['W', 'W'], // sizeY
      [CubeEdge.TopLeft]: ['W', 'W'], // sizeZ
      [CubeEdge.TopRight]: ['W', 'W'], // sizeZ
      [CubeEdge.DownLeft]: ['W', 'W'], // sizeZ
      [CubeEdge.DownRight]: ['W', 'W'], // sizeZ
      [CubeEdge.BackTop]: ['W', 'W'], // sizeX
      [CubeEdge.BackDown]: ['W', 'W'], // sizeX
      [CubeEdge.BackLeft]: ['W', 'W'], // sizeY
      [CubeEdge.BackRight]: ['W', 'W'], // sizeY
    },
  },
};

export default Level03;