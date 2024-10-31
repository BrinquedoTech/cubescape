import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { EnemyType } from '../../Enums/EnemyType';
import { SceneType } from '../../Enums/SceneType';

// Empty = ' ', '  '
// Wall = 'W', 'WW'
// Start = 'S', 'ST'
// Finish = 'F', 'FI'
// WallSpike = 'X{id}'
// FloorSpike = 'I{id}'
// Coin = 'C', 'CC'

const Level05: ILevelConfig = {
  size: new THREE.Vector3(4, 4, 4),
  sceneType: SceneType.Light,
  map: {
    sides: {
      [CubeSide.Front]: [
        ['ST', '  ', '  ', 'CC'],
        ['WW', 'WW', 'WW', '  '],
        ['  ', 'I1', 'I2', '  '],
        ['CC', 'CC', 'CC', 'CC'],
      ],
      [CubeSide.Left]: [
        ['WW', 'CC', '  ', 'CC'],
        ['CC', 'I3', 'CC', 'WW'],
        ['  ', 'CC', '  ', '  '],
        ['CC', '  ', '  ', 'CC'],
      ],
      [CubeSide.Right]: [
        ['CC', '  ', '  ', '  '],
        ['  ', 'WW', 'I4', 'CC'],
        ['  ', 'WW', '  ', 'WW'],
        ['CC', 'WW', 'CC', '  '],
      ],
      [CubeSide.Top]: [
        ['  ', 'CC', 'WW', 'CC'],
        ['WW', '  ', '  ', '  '],
        ['CC', 'CC', 'WW', '  '],
        ['CC', 'CC', '  ', 'CC'],
      ],
      [CubeSide.Bottom]: [
        ['I6', 'CC', 'CC', 'I7'],
        ['  ', 'WW', 'WW', '  '],
        ['CC', 'WW', 'CC', '  '],
        ['  ', 'WW', '  ', 'CC'],
      ],
      [CubeSide.Back]: [
        ['  ', 'CC', 'WW', 'CC'],
        ['  ', '  ', 'WW', 'WW'],
        ['  ', 'I5', '  ', 'FI'],
        ['  ', 'CC', 'WW', '  '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]:   ['WW', 'WW', 'WW', 'WW'],
      [CubeEdge.FrontDown]:  ['WW', 'WW', 'WW', 'WW'],
      [CubeEdge.FrontLeft]:  ['WW', '  ', 'WW', 'WW'],
      [CubeEdge.FrontRight]: ['WW', '  ', 'WW', 'WW'],
      [CubeEdge.TopLeft]:    ['WW', 'WW', 'WW', 'WW'],
      [CubeEdge.TopRight]:   ['WW', 'WW', 'WW', 'WW'],
      [CubeEdge.DownLeft]:   ['WW', 'WW', 'WW', 'WW'],
      [CubeEdge.DownRight]:  ['WW', 'WW', 'WW', 'WW'],
      [CubeEdge.BackTop]:    ['  ', 'WW', 'WW', '  '],
      [CubeEdge.BackDown]:   ['  ', 'WW', '  ', 'WW'],
      [CubeEdge.BackLeft]:   ['WW', 'WW', 'WW', 'WW'],
      [CubeEdge.BackRight]:  ['  ', 'WW', 'WW', 'WW'],
    },
  },
  enemies: {
    [EnemyType.FloorSpike]: [
      { id: 1, inactiveTime: 1, activeTime: 1.3 },
      { id: 2, inactiveTime: 1.5, activeTime: 1 },
      { id: 3, inactiveTime: 1, activeTime: 1 },
      { id: 4, inactiveTime: 1.2, activeTime: 1 },
      { id: 5, inactiveTime: 1.5, activeTime: 0.5 },
      { id: 6, inactiveTime: 2, activeTime: 0.7 },
      { id: 7, inactiveTime: 1.5, activeTime: 0.5 },
    ],
  }
};

export default Level05;
