import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { EnemyType } from '../../Enums/EnemyType';
import { Direction } from '../../Enums/Direction';

// Empty = ' ', '  ',
// Wall = 'W', 'WW',
// Start = 'S', 'ST',
// Finish = 'F', 'FI',
// Spike = 'X{id}',

const Level05: ILevelConfig = {
  size: new THREE.Vector3(7, 7, 7),
  map: {
    sides: {
      [CubeSide.Front]: [
        ['ST', '  ', '  ', 'X1', 'CC', 'CC', '  '],
        ['  ', '  ', '  ', '  ', 'CC', 'CC', '  '],
        ['  ', '  ', '  ', 'WW', 'CC', 'CC', '  '],
        ['  ', '  ', 'WW', 'WW', 'WW', '  ', '  '],
        ['  ', '  ', '  ', 'WW', '  ', '  ', '  '],
        ['  ', 'CC', '  ', '  ', '  ', '  ', '  '],
        ['CC', '  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Left]: [
        ['X3', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', 'C', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Right]: [
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', 'C', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', 'X4', '  ', '  ', '  '],
      ],
      [CubeSide.Top]: [
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', 'X2', '  ', '  ', '  '],
      ],
      [CubeSide.Bottom]: [
        ['  ', '  ', '  ', 'X5', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Back]: [
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', 'FI', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', 'X6', '  ', '  ', '  '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]:   ['  ', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
      [CubeEdge.FrontDown]:  ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', '  '],
      [CubeEdge.FrontLeft]:  ['  ', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
      [CubeEdge.FrontRight]: ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', '  '],
      [CubeEdge.TopLeft]:    ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
      [CubeEdge.TopRight]:   ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
      [CubeEdge.DownLeft]:   ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
      [CubeEdge.DownRight]:  ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
      [CubeEdge.BackTop]:    ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', '  '],
      [CubeEdge.BackDown]:   ['  ', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
      [CubeEdge.BackLeft]:   ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
      [CubeEdge.BackRight]:  ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
    },
  },
  enemies: {
    [EnemyType.WallSpike]: [
      { id: 1, directions: [Direction.Left] },
      { id: 2, directions: [Direction.Right] },
      { id: 3, directions: [Direction.Down] },
      { id: 4, directions: [Direction.Right] },
      { id: 5, directions: [Direction.Left] },
      { id: 6, directions: [Direction.Left] },
    ],
  }
};

export default Level05;
