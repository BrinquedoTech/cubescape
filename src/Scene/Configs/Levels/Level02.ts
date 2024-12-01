import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";
import { EnemyType } from '../../Enums/EnemyType';
import { Direction } from '../../Enums/Direction';
import { SceneType } from '../../Enums/SceneType';

// Empty = ' ', '  '
// Wall = 'W', 'WW'
// Start = 'S', 'ST'
// Finish = 'F', 'FI'
// WallSpike = 'X{id}'
// FloorSpike = 'I{id}'
// Coin = 'C', 'CC'

const Level02: ILevelConfig = {
  size: new THREE.Vector3(7, 7, 7),
  sceneType: SceneType.Dark,
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        ['CC', '  ', 'CC', 'WW', 'CC', '  ', 'CC'],
        ['  ', 'WW', '  ', 'WW', '  ', 'WW', '  '],
        ['  ', 'WW', '  ', 'WW', '  ', 'WW', 'WW'],
        ['  ', 'WW', 'FI', 'WW', 'ST', '  ', 'CC'],
        ['  ', 'WW', 'X8', 'WW', '  ', 'WW', '  '],
        ['  ', 'X7', '  ', 'X9', '  ', 'WW', '  '],
        ['CC', '  ', 'CC', 'WW', 'CC', '  ', 'CC'],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        ['CC', '  ', 'CC', '  ', 'CC', '  ', 'CC'],
        ['  ', 'WW', '  ', 'CC', '  ', 'CC', '  '],
        ['  ', '  ', '  ', 'WW', '  ', '  ', 'WW'],
        ['CC', '  ', '  ', 'CC', '  ', '  ', 'CC'],
        ['  ', 'WW', '  ', '  ', 'WW', '  ', 'WW'],
        ['  ', 'CC', '  ', '  ', '  ', 'CC', '  '],
        ['  ', '  ', 'WW', '  ', '  ', '  ', 'CC'],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        ['WW', 'WW', 'WW', '  ', '  ', 'CC', 'WW'],
        ['  ', 'CC', 'WW', 'WW', 'WW', 'I2', 'CC'],
        ['WW', '  ', 'WW', 'WW', 'WW', 'WW', '  '],
        ['  ', 'CC', 'WW', 'CC', '  ', '  ', '  '],
        ['  ', 'WW', 'WW', '  ', 'WW', 'WW', 'WW'],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['CC', 'CC', 'WW', 'CC', '  ', 'I1', 'CC'],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        ['  ', 'CC', '  ', 'WW', 'CC', '  ', '  '],
        ['CC', 'WW', 'CC', 'WW', '  ', 'WW', '  '],
        ['  ', 'CC', '  ', '  ', 'CC', 'WW', '  '],
        ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', '  '],
        ['CC', '  ', 'CC', '  ', 'CC', 'WW', '  '],
        ['  ', 'WW', 'WW', 'WW', 'I3', 'WW', '  '],
        ['CC', '  ', 'CC', '  ', 'CC', '  ', 'CC'],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        ['  ', 'CC', '  ', 'WW', 'WW', 'X1', 'WW'],
        ['CC', 'WW', 'CC', '  ', 'CC', '  ', 'X2'],
        ['  ', 'CC', 'I5', '  ', '  ', '  ', 'X3'],
        ['  ', 'WW', 'WW', 'WW', '  ', '  ', 'X4'],
        ['  ', '  ', 'CC', 'WW', '  ', '  ', 'X5'],
        ['WW', 'WW', '  ', 'WW', '  ', 'X6', 'WW'],
        ['  ', '  ', 'CC', 'WW', 'CC', '  ', '  '],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        ['CC', 'WW', 'WW', 'CC', '  ', '  ', 'CC'],
        ['CC', 'WW', 'CC', '  ', '  ', 'WW', '  '],
        ['  ', '  ', '  ', '  ', 'I4', '  ', 'CC'],
        ['  ', '  ', '  ', 'WW', '  ', 'WW', '  '],
        ['  ', '  ', 'CC', '  ', 'CC', '  ', 'CC'],
        ['  ', 'WW', '  ', 'WW', '  ', 'WW', '  '],
        ['  ', 'WW', 'CC', '  ', 'CC', '  ', 'CC'],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.FrontDown]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.FrontLeft]: ['W', 'W', 'W', ' ', 'W', 'W', 'W'], // sizeY
      [CubeEdge.FrontRight]: ['W', 'W', 'W', 'W', 'W', ' ', 'W'], // sizeY
      [CubeEdge.TopLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.TopRight]: ['W', 'W', 'W', ' ', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.DownLeft]: [' ', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.DownRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeZ
      [CubeEdge.BackTop]: ['W', 'W', ' ', 'W', 'W', 'W', 'W'], // sizeX
      [CubeEdge.BackDown]: ['W', 'W', 'W', 'W', 'W', 'W', ' '], // sizeX
      [CubeEdge.BackLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeY
      [CubeEdge.BackRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'], // sizeY
    },
  },
  enemies: {
    [EnemyType.WallSpike]: [
      { id: 1, directions: [Direction.Down] },
      { id: 2, directions: [Direction.Left] },
      { id: 3, directions: [Direction.Left] },
      { id: 4, directions: [Direction.Left] },
      { id: 5, directions: [Direction.Left] },
      { id: 6, directions: [Direction.Up] },
      { id: 7, directions: [Direction.Right] },
      { id: 8, directions: [Direction.Down] },
      { id: 9, directions: [Direction.Left] },
    ],
    [EnemyType.FloorSpike]: [
      { id: 1, inactiveTime: 2, activeTime: 1 },
      { id: 2, inactiveTime: 2, activeTime: 1 },
      { id: 3, inactiveTime: 2, activeTime: 1 },
      { id: 4, inactiveTime: 2, activeTime: 1 },
      { id: 5, inactiveTime: 2, activeTime: 1 },
    ],
  }
};

export default Level02;