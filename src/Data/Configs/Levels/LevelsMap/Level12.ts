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

const Level12: ILevelConfig = {
  size: new THREE.Vector3(3, 5, 8),
  sceneType: SceneType.Light,
  map: {
    sides: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', 'ST', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['FI', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
        ['  ', '  ', '  '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]:   ['WW', 'WW', '  '], // sizeX
      [CubeEdge.FrontDown]:  ['  ', 'WW', 'WW'], // sizeX
      [CubeEdge.FrontLeft]:  ['WW', 'WW', 'WW', 'WW', '  '], // sizeY
      [CubeEdge.FrontRight]: ['  ', 'WW', 'WW', 'WW', 'WW'], // sizeY
      [CubeEdge.TopLeft]:    ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'], // sizeZ
      [CubeEdge.TopRight]:   ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'], // sizeZ
      [CubeEdge.DownLeft]:   ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'], // sizeZ
      [CubeEdge.DownRight]:  ['WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW', 'WW'], // sizeZ
      [CubeEdge.BackTop]:    ['  ', 'WW', 'WW'], // sizeX
      [CubeEdge.BackDown]:   ['WW', 'WW', '  '], // sizeX
      [CubeEdge.BackLeft]:   ['  ', 'WW', 'WW', 'WW', 'WW'], // sizeY
      [CubeEdge.BackRight]:  ['WW', 'WW', 'WW', 'WW', '  '], // sizeY
    },
  },
};

export default Level12;
