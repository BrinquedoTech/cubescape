import * as THREE from 'three';
import { CubeEdge } from "../../../Enums/Cube/CubeEdge";
import { CubeSide } from "../../../Enums/Cube/CubeSide";
import { ILevelConfig } from "../../../Interfaces/ILevelConfig";
import { SceneType } from '../../../Enums/SceneType';

// Empty = ' ', '  '
// Wall = 'W', 'WW'
// Start = 'S', 'ST'
// Finish = 'F', 'FI'
// WallSpike = 'X{id}'
// FloorSpike = 'I{id}'
// Coin = 'C', 'CC'

const Level07: ILevelConfig = {
  size: new THREE.Vector3(3, 3, 3),
  sceneType: SceneType.Light,
  map: {
    sides: {
      [CubeSide.Front]: [
        ['  ', '  ', '  '],
        ['  ', 'ST', 'FI'],
        ['  ', '  ', '  '],
      ],
      [CubeSide.Left]: [
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
      [CubeSide.Right]: [
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
      [CubeSide.Top]: [
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
      [CubeSide.Bottom]: [
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
      [CubeSide.Back]: [
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]:   [' ', ' ', ' '],
      [CubeEdge.FrontDown]:  [' ', 'W', ' '],
      [CubeEdge.FrontLeft]:  [' ', ' ', ' '],
      [CubeEdge.FrontRight]: [' ', ' ', 'W'],
      [CubeEdge.TopLeft]:    [' ', ' ', ' '],
      [CubeEdge.TopRight]:   [' ', 'W', ' '],
      [CubeEdge.DownLeft]:   [' ', 'W', 'W'],
      [CubeEdge.DownRight]:  [' ', ' ', ' '],
      [CubeEdge.BackTop]:    ['W', 'W', ' '],
      [CubeEdge.BackDown]:   [' ', ' ', ' '],
      [CubeEdge.BackLeft]:   ['W', ' ', 'W'],
      [CubeEdge.BackRight]:  [' ', ' ', ' '],
    },
  },
};

export default Level07;
