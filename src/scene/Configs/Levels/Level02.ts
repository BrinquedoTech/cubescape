import * as THREE from 'three';
import { CubeEdge } from "../../Enums/CubeEdge";
import { CubeSide } from "../../Enums/CubeSide";
import { ILevelConfig } from "../../Interfaces/ILevelConfig";

const Level02: ILevelConfig = {
  size: new THREE.Vector3(5, 6, 7),
  map: {
    surfaces: {
      [CubeSide.Front]: [
        // sizeX x sizeY
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
      ],
      [CubeSide.Left]: [
        // sizeZ x sizeY
        [1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1],
      ],
      [CubeSide.Right]: [
        // sizeZ x sizeY
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1],
      ],
      [CubeSide.Top]: [
        // sizeX x sizeZ
        [1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
      ],
      [CubeSide.Bottom]: [
        // sizeX x sizeZ
        [1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
      ],
      [CubeSide.Back]: [
        // sizeX x sizeY
        [1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1],
      ],
    },
    edges: {
      [CubeEdge.FrontTop]: [1, 1, 1, 1, 1], // sizeX
      [CubeEdge.FrontDown]: [1, 1, 1, 1, 1], // sizeX
      [CubeEdge.FrontLeft]: [1, 1, 1, 1, 1, 1], // sizeY
      [CubeEdge.FrontRight]: [1, 1, 1, 1, 1, 1], // sizeY
      [CubeEdge.TopLeft]: [1, 1, 1, 1, 1, 1, 1], // sizeZ
      [CubeEdge.TopRight]: [1, 1, 1, 1, 1, 1, 1], // sizeZ
      [CubeEdge.DownLeft]: [1, 1, 1, 1, 1, 1, 1], // sizeZ
      [CubeEdge.DownRight]: [1, 1, 1, 1, 1, 1, 1], // sizeZ
      [CubeEdge.BackTop]: [1, 1, 1, 1, 1], // sizeX
      [CubeEdge.BackDown]: [1, 1, 1, 1, 1], // sizeX
      [CubeEdge.BackLeft]: [1, 1, 1, 1, 1, 1], // sizeY
      [CubeEdge.BackRight]: [1, 1, 1, 1, 1, 1], // sizeY
    },
  },
  playerCharacter: {
    gridPosition: new THREE.Vector2(1, 2),
    direction: 0,
    side: CubeSide.Front,
  },
};

export default Level02;