import * as THREE from 'three';
import Cube from './Cube/Cube';
import LevelsConfig from '../Configs/LevelsConfig';
import { ILevelConfig } from '../Interfaces/ILevelConfig';

export default class GameScene extends THREE.Group {
  private cube: Cube;

  constructor() {
    super();

    this.init();
  }

  public update(dt: number) {
    
  }

  private init() {
    const levelId: number = 0;
    const levelConfig: ILevelConfig = LevelsConfig[levelId];

    this.cube = new Cube(levelConfig);
    this.add(this.cube);
  }
}
