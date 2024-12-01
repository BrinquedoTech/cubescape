import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { SceneType } from '../../Enums/SceneType';

// Empty = ' ', '  '
// Wall = 'W', 'WW'
// Start = 'S', 'ST'
// Finish = 'F', 'FI'
// WallSpike = 'X{id}'
// FloorSpike = 'I{id}'
// Coin = 'C', 'CC'

const Level08: ILevelConfig = {
  size: new THREE.Vector3(6, 6, 6),
  sceneType: SceneType.Light,
  map: {
    sides: {
      [CubeSide.Front]: [
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', 'ST', 'FI', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Left]: [
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Right]: [
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Top]: [
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Bottom]: [
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Back]: [
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]:   [' ', ' ', ' ', 'W', 'W', ' '],
      [CubeEdge.FrontDown]:  [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.FrontLeft]:  [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.FrontRight]: [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.TopLeft]:    [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.TopRight]:   [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.DownLeft]:   [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.DownRight]:  [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.BackTop]:    [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.BackDown]:   [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.BackLeft]:   [' ', ' ', ' ', ' ', ' ', ' '],
      [CubeEdge.BackRight]:  [' ', ' ', ' ', ' ', ' ', ' '],
    },
  },
};

export default Level08;
