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

const Level02: ILevelConfig = {
  size: new THREE.Vector3(8, 8, 8),
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        ['CC', '  ', '  ', '  ', '  ', '  ', '  ', 'CC'],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', 'WW'],
        ['  ', '  ', 'WW', 'CC', 'WW', 'WW', '  ', '  '],
        ['  ', '  ', 'WW', 'ST', '  ', 'CC', '  ', '  '],
        ['WW', '  ', 'CC', '  ', '  ', 'WW', '  ', '  '],
        ['  ', '  ', 'WW', 'WW', 'CC', 'WW', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['CC', '  ', '  ', '  ', '  ', 'WW', '  ', 'CC'],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        ['CC', 'CC', 'WW', 'WW', 'CC', '  ', '  ', 'I3'],
        ['CC', 'CC', 'WW', 'WW', '  ', '  ', 'WW', 'CC'],
        ['CC', 'CC', 'I1', 'I2', '  ', 'CC', 'WW', 'CC'],
        ['WW', 'WW', 'WW', 'WW', 'WW', '  ', 'WW', 'CC'],
        ['CC', 'CC', 'CC', 'CC', 'WW', '  ', 'WW', 'WW'],
        ['CC', 'WW', 'CC', 'CC', 'WW', 'CC', '  ', '  '],
        ['CC', '  ', 'CC', 'WW', 'WW', '  ', '  ', '  '],
        ['CC', 'CC', 'CC', '  ', 'I4', '  ', '  ', 'CC'],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        ['CC', '  ', 'CC', 'WW', '  ', 'CC', '  ', 'CC'],
        ['WW', '  ', '  ', '  ', '  ', '  ', 'WW', '  '],
        ['CC', '  ', '  ', '  ', 'I8', '  ', '  ', 'CC'],
        ['  ', '  ', 'WW', '  ', '  ', '  ', 'WW', '  '],
        ['WW', '  ', '  ', '  ', '  ', '  ', 'WW', '  '],
        ['  ', '  ', 'CC', '  ', 'CC', '  ', '  ', 'CC'],
        ['  ', 'X1', '  ', 'WW', '  ', 'X2', 'WW', 'WW'],
        ['CC', '  ', '  ', 'WW', '  ', 'CC', 'CC', 'CC'],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        ['WW', 'CC', 'I5', '  ', 'I6', '  ', 'I7', 'CC'],
        ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', '  '],
        ['CC', 'CC', 'CC', 'WW', 'CC', '  ', '  ', '  '],
        ['  ', '  ', 'WW', 'WW', '  ', 'WW', 'WW', 'WW'],
        ['CC', '  ', 'CC', 'WW', 'CC', '  ', 'CC', '  '],
        ['WW', '  ', '  ', 'WW', '  ', '  ', '  ', '  '],
        ['  ', '  ', 'CC', 'WW', '  ', '  ', '  ', 'WW'],
        ['  ', '  ', '  ', '  ', 'CC', '  ', 'CC', 'WW'],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        ['WW', 'WW', 'WW', 'WW', 'CC', '  ', '  ', 'CC'],
        ['  ', 'CC', '  ', '  ', 'I11', 'CC', '  ', '  '],
        ['  ', 'WW', 'WW', '  ', '  ', '  ', '  ', 'WW'],
        ['CC', '  ', '  ', 'CC', 'I10', '  ', '  ', 'CC'],
        ['WW', '  ', 'WW', '  ', '  ', 'WW', '  ', '  '],
        ['  ', '  ', 'CC', '  ', 'I9', '  ', '  ', 'CC'],
        ['  ', 'WW', 'WW', 'WW', '  ', 'WW', '  ', 'WW'],
        ['CC', '  ', '  ', '  ', 'CC', '  ', 'CC', 'WW'],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        ['CC', '  ', '  ', '  ', 'FI', 'WW', 'CC', 'CC'],
        ['  ', 'WW', 'X3', 'X4', 'WW', 'WW', 'WW', 'WW'],
        ['  ', 'WW', '  ', '  ', 'WW', 'CC', 'CC', 'CC'],
        ['  ', 'WW', '  ', '  ', '  ', 'CC', 'WW', 'CC'],
        ['  ', 'WW', '  ', '  ', '  ', 'CC', 'CC', 'CC'],
        ['  ', '  ', '  ', '  ', 'CC', '  ', '  ', 'WW'],
        ['  ', '  ', 'WW', 'WW', 'WW', 'CC', '  ', '  '],
        ['CC', 'CC', 'WW', '  ', '  ', '  ', '  ', '  '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: [' ', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.FrontDown]: ['W', 'W', 'W', 'W', 'W', 'W', ' ', 'W'], // sizeX
      [CubeEdge.FrontLeft]: ['W', 'W', ' ', 'W', 'W', 'W', 'W', 'W'], // sizeY
      [CubeEdge.FrontRight]: ['W', 'W', 'W', 'W', 'W', ' ', 'W', 'W'], // sizeY
      [CubeEdge.TopLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.TopRight]: ['W', 'W', 'W', 'W', 'W', ' ', 'W', 'W'], // sizeZ
      [CubeEdge.DownLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.DownRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.BackTop]: ['W', ' ', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.BackDown]: ['W', 'W', 'W', 'W', ' ', 'W', 'W', 'W'], // sizeX
      [CubeEdge.BackLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeY
      [CubeEdge.BackRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeY
    },
  },
  enemies: {
    [EnemyType.WallSpike]: [
      { id: 1, directions: [Direction.Up] },
      { id: 2, directions: [Direction.Up] },
      { id: 3, directions: [Direction.Down] },
      { id: 4, directions: [Direction.Down] },
    ],
    [EnemyType.FloorSpike]: [
      { id: 1, inactiveTime: 2.5, activeTime: 0.5 },
      { id: 2, inactiveTime: 2, activeTime: 1 },
      { id: 3, inactiveTime: 2, activeTime: 1 },
      { id: 4, inactiveTime: 1.5, activeTime: 1 },
      { id: 5, inactiveTime: 2, activeTime: 0.7 },
      { id: 6, inactiveTime: 1.7, activeTime: 0.6 },
      { id: 7, inactiveTime: 1.5, activeTime: 0.5 },
      { id: 8, inactiveTime: 2, activeTime: 1 },
      { id: 9, inactiveTime: 3, activeTime: 1 },
      { id: 10, inactiveTime: 2, activeTime: 1 },
      { id: 11, inactiveTime: 1, activeTime: 1 },
    ],
  }
};

export default Level02;