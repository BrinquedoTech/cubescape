import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { EnemyType } from '../../Enums/EnemyType';
import { Direction } from '../../Enums/Direction';

// Empty = ' ', '  '
// Wall = 'W', 'WW'
// Start = 'S', 'ST'
// Finish = 'F', 'FI'
// WallSpike = 'X{id}'
// FloorSpike = 'I{id}'
// Coin = 'C', 'CC'

const Level04: ILevelConfig = {
  size: new THREE.Vector3(5, 5, 8),
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        ['CC', '  ', 'CC', 'WW', 'CC'],
        ['  ', 'WW', '  ', 'WW', '  '],
        ['  ', 'WW', 'ST', 'WW', '  '],
        ['  ', 'WW', 'WW', 'WW', '  '],
        ['CC', '  ', '  ', '  ', 'CC'],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        ['WW', 'CC', '  ', 'CC', '  ', 'CC', '  ', 'CC'],
        ['WW', '  ', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'],
        ['  ', 'I4', 'CC', '  ', 'CC', '  ', 'CC', 'I5'],
        ['WW', '  ', 'WW', 'WW', 'WW', 'WW', '  ', 'CC'],
        ['CC', '  ', '  ', '  ', '  ', '  ', 'CC', 'WW'],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        ['  ', 'CC', 'WW', '  ', '  ', 'CC', '  ', '  '],
        ['  ', 'CC', 'WW', 'WW', '  ', '  ', '  ', '  '],
        ['  ', 'WW', 'WW', 'CC', '  ', 'WW', 'CC', '  '],
        ['  ', '  ', '  ', '  ', 'CC', 'WW', '  ', 'WW'],
        ['CC', '  ', 'WW', '  ', '  ', 'X1', 'CC', '  '],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        ['CC', '  ', 'I3', '  ', 'CC'],
        ['  ', '  ', '  ', 'WW', '  '],
        ['CC', '  ', 'CC', 'WW', '  '],
        ['WW', 'WW', 'WW', 'WW', '  '],
        ['CC', 'I1', '  ', '  ', '  '],
        ['CC', 'I2', '  ', '  ', '  '],
        ['WW', 'WW', '  ', '  ', 'CC'],
        ['  ', '  ', 'CC', 'WW', 'WW'],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        ['CC', 'CC', 'CC', 'CC', 'CC'],
        ['  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', 'WW', 'WW', 'WW'],
        ['I6', 'CC', 'CC', 'CC', 'I7'],
        ['WW', 'WW', 'WW', '  ', '  '],
        ['CC', '  ', 'CC', 'CC', '  '],
        ['  ', '  ', '  ', '  ', '  '],
        ['  ', 'WW', 'CC', '  ', 'CC'],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        ['CC', 'WW', 'CC', '  ', 'CC'],
        ['  ', 'WW', 'WW', 'WW', '  '],
        ['CC', 'WW', 'FI', '  ', 'CC'],
        ['WW', 'WW', 'WW', 'WW', '  '],
        ['CC', '  ', 'CC', 'WW', 'CC'],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: ['W', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.FrontDown]: ['W', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.FrontLeft]: ['W', 'W', 'W', 'W', 'W'], // sizeY
      [CubeEdge.FrontRight]: ['W', 'W', 'W', 'W', ' '], // sizeY
      [CubeEdge.TopLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W', ' '], // sizeZ
      [CubeEdge.TopRight]: ['W', 'W', 'W', 'W', ' ', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.DownLeft]: [' ', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.DownRight]: ['W', 'W', 'W', 'W', 'W', 'W', ' ', 'W'], // sizeZ
      [CubeEdge.BackTop]: ['W', 'W', ' ', 'W', 'W'], // sizeX
      [CubeEdge.BackDown]: ['W', 'W', ' ', 'W', 'W'], // sizeX
      [CubeEdge.BackLeft]: ['W', 'W', ' ', 'W', 'W'], // sizeY
      [CubeEdge.BackRight]: ['W', 'W', ' ', 'W', 'W'], // sizeY
    },
  },
  enemies: {
    [EnemyType.WallSpike]: [
      { id: 1, directions: [Direction.Left, Direction.Right] },
    ],
    [EnemyType.FloorSpike]: [
      { id: 1, inactiveTime: 2, activeTime: 1 },
      { id: 2, inactiveTime: 2.5, activeTime: 1.2 },
      { id: 3, inactiveTime: 1.5, activeTime: 1 },
      { id: 4, inactiveTime: 1, activeTime: 1 },
      { id: 5, inactiveTime: 2, activeTime: 1 },
      { id: 6, inactiveTime: 1.8, activeTime: 0.8 },
      { id: 7, inactiveTime: 2, activeTime: 1.1 },
    ],
  }
};

export default Level04;