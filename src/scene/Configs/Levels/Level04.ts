import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";

// Empty = ' ',
// Wall = 'W',
// Start = 'S',
// Finish = 'F',

const Level04: ILevelConfig = {
  size: new THREE.Vector3(1, 1, 2),
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        ['S'],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        [' ', ' '],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        [' ', ' '],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        [' '],
        [' '],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        [' '],
        [' '],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        ['F'],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: [' '], // sizeX
      [CubeEdge.FrontDown]: ['W'], // sizeX
      [CubeEdge.FrontLeft]: ['W'], // sizeY
      [CubeEdge.FrontRight]: ['W'], // sizeY
      [CubeEdge.TopLeft]: ['W', 'W'], // sizeZ
      [CubeEdge.TopRight]: [' ', 'W'], // sizeZ
      [CubeEdge.DownLeft]: [' ', 'W'], // sizeZ
      [CubeEdge.DownRight]: ['W', ' '], // sizeZ
      [CubeEdge.BackTop]: ['W'], // sizeX
      [CubeEdge.BackDown]: ['W'], // sizeX
      [CubeEdge.BackLeft]: [' '], // sizeY
      [CubeEdge.BackRight]: ['W'], // sizeY
    },
  },
};

export default Level04;