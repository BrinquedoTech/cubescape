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

const Level06: ILevelConfig = {
  size: new THREE.Vector3(1, 1, 1),
  sceneType: SceneType.Light,
  map: {
    sides: {
      [CubeSide.Front]: [
        ['ST'],
      ],
      [CubeSide.Left]: [
        ['  '],
      ],
      [CubeSide.Right]: [
        ['  '],
      ],
      [CubeSide.Top]: [
        ['FI'],
      ],
      [CubeSide.Bottom]: [
        ['  '],
      ],
      [CubeSide.Back]: [
        ['  '],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]:   ['  '],
      [CubeEdge.FrontDown]:  ['WW'],
      [CubeEdge.FrontLeft]:  ['WW'],
      [CubeEdge.FrontRight]: ['WW'],
      [CubeEdge.TopLeft]:    ['WW'],
      [CubeEdge.TopRight]:   ['WW'],
      [CubeEdge.DownLeft]:   ['WW'],
      [CubeEdge.DownRight]:  ['WW'],
      [CubeEdge.BackTop]:    ['WW'],
      [CubeEdge.BackDown]:   ['WW'],
      [CubeEdge.BackLeft]:   ['WW'],
      [CubeEdge.BackRight]:  ['WW'],
    },
  },
};

export default Level06;
