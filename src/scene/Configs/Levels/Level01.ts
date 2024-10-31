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

const Level01: ILevelConfig = {
  size: new THREE.Vector3(7, 7, 7),
  sceneType: SceneType.Light,
  map: {
    sides: {
      [CubeSide.Front]: [
        ['C', ' ', ' ', 'C', ' ', ' ', 'C'],
        [' ', 'W', 'W', 'W', 'W', 'W', ' '],
        [' ', 'W', 'C', ' ', ' ', ' ', 'C'],
        [' ', 'W', ' ', 'C', 'W', ' ', ' '],
        [' ', 'W', 'C', ' ', 'W', ' ', ' '],
        [' ', 'W', 'W', ' ', 'W', ' ', ' '],
        ['S', 'W', 'W', ' ', 'W', 'C', 'C'],
      ],
      [CubeSide.Left]: [
        [' ', ' ', 'C', ' ', 'C', 'W', 'W'],
        [' ', ' ', ' ', ' ', ' ', ' ', 'C'],
        ['C', ' ', 'C', 'W', 'C', 'I2', 'C'],
        ['W', 'W', ' ', 'W', 'W', ' ', ' '],
        [' ', ' ', 'C', ' ', ' ', ' ', 'C'],
        ['W', 'W', ' ', ' ', ' ', ' ', 'W'],
        ['W', 'W', 'C', ' ', 'I1', ' ', 'C'],
      ],
      [CubeSide.Right]: [
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        [' ', 'W', 'W', 'W', ' ', 'W', ' '],
        ['C', 'W', 'C', ' ', 'C', ' ', ' '],
        [' ', 'W', ' ', 'W', ' ', 'W', 'W'],
        [' ', 'W', ' ', 'W', ' ', 'W', 'W'],
        [' ', 'W', 'C', ' ', 'C', 'W', 'W'],
      ],
      [CubeSide.Top]: [
        [' ', 'W', 'W', 'C', ' ', ' ', ' '],
        [' ', 'W', 'W', ' ', ' ', 'X1', 'W'],
        ['C', ' ', ' ', 'C', ' ', 'X2', ' '],
        ['W', 'W', 'W', 'W', 'W', 'W', ' '],
        ['C', ' ', ' ', 'C', ' ', ' ', 'C'],
        [' ', 'W', 'W', 'W', 'W', 'W', 'W'],
        ['C', ' ', ' ', 'C', ' ', ' ', ' '],
      ],
      [CubeSide.Bottom]: [
        [' ', ' ', ' ', 'C', ' ', ' ', ' '],
        [' ', 'W', 'W', ' ', 'W', 'W', 'W'],
        [' ', 'C', 'W', ' ', 'W', 'C', 'C'],
        ['C', ' ', 'W', 'C', 'W', 'C', 'C'],
        ['W', ' ', 'W', ' ', 'W', 'C', 'C'],
        [' ', ' ', 'W', ' ', 'W', 'C', 'C'],
        ['C', ' ', ' ', ' ', ' ', ' ', ' '],
      ],
      [CubeSide.Back]: [
        ['C', ' ', ' ', 'I3', ' ', ' ', 'C'],
        [' ', 'W', 'W', ' ', 'W', 'W', ' '],
        [' ', 'W', 'C', 'C', 'C', 'W', ' '],
        [' ', 'W', 'C', 'F', 'C', 'W', ' '],
        [' ', 'W', 'W', ' ', ' ', 'W', ' '],
        [' ', 'W', 'W', ' ', ' ', 'W', ' '],
        ['C', ' ', ' ', ' ', 'C', 'W', 'C'],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.FrontDown]: ['W', 'W', 'W', ' ', 'W', 'W', 'W'],
      [CubeEdge.FrontLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.FrontRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.TopLeft]: [' ', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.TopRight]: [' ', 'W', ' ', 'W', 'W', 'W', ' '],
      [CubeEdge.DownLeft]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.DownRight]: ['W', 'W', 'W', 'W', 'W', 'W', ' '],
      [CubeEdge.BackTop]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackDown]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackLeft]: ['W', 'W', ' ', 'W', 'W', 'W', 'W'],
      [CubeEdge.BackRight]: ['W', 'W', 'W', 'W', 'W', 'W', 'W'],
    },
  },
  enemies: {
    [EnemyType.WallSpike]: [
      { id: 1, directions: [Direction.Left] },
      { id: 2, directions: [Direction.Left] },
    ],
    [EnemyType.FloorSpike]: [
      { id: 1, inactiveTime: 1.5, activeTime: 1 },
      { id: 2, inactiveTime: 2.5, activeTime: 1 },
      { id: 3, inactiveTime: 2, activeTime: 1 },
    ],
  }
};

export default Level01;
