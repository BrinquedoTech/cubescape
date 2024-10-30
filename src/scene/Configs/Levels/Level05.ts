import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { EnemyType } from '../../Enums/EnemyType';
import { Direction } from '../../Enums/Direction';
import { SceneType } from '../../Enums/SceneType';

// Empty = ' ', '  ',
// Wall = 'W', 'WW',
// Start = 'S', 'ST',
// Finish = 'F', 'FI',
// Spike = 'X{id}',

const Level05: ILevelConfig = {
  size: new THREE.Vector3(7, 7, 7),
  sceneType: SceneType.Light,
  map: {
    sides: {
      [CubeSide.Front]: [
        ['FI', 'ST', '  ', 'X1', 'CC', 'CC', '  '],
        ['  ', '  ', '  ', 'X8', 'CC', 'CC', '  '],
        ['  ', '  ', '  ', 'X9', 'CC', 'CC', '  '],
        ['  ', '  ', 'WW', 'WW', 'WW', '  ', '  '],
        ['  ', '  ', '  ', 'WW', '  ', '  ', '  '],
        ['  ', 'CC', '  ', '  ', '  ', 'I1', 'I2'],
        ['CC', '  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Left]: [
        ['X3', 'X7', '  ', '  ', '  ', '  ', '  '],
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
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
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
      { id: 7, directions: [Direction.Down] },
      { id: 8, directions: [Direction.Right, Direction.Left] },
      { id: 9, directions: [Direction.Right] },
    ],
    [EnemyType.FloorSpike]: [
      { id: 1, inactiveTime: 1, activeTime: 2 },
      { id: 2, inactiveTime: 2, activeTime: 1 },
    ],
  }
};

export default Level05;
