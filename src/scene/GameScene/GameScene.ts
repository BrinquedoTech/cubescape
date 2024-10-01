import * as THREE from 'three';
import Cube from './Cube/Cube';
import LevelsConfig from '../Configs/LevelsConfig';
import { ILevelConfig } from '../Interfaces/ILevelConfig';
import PlayCharacter from './PlayCharacter/PlayCharacter';

export default class GameScene extends THREE.Group {
  private cube: Cube;
  private playCharacter: PlayCharacter;

  constructor() {
    super();

    this.init();

    this.startLevel(0);
  }

  public update(dt: number): void {
    
  }

  public startLevel(levelId: number): void {
    const levelConfig: ILevelConfig = LevelsConfig[levelId];

    this.cube.init(levelConfig);
    this.playCharacter.init(levelConfig);
  }

  private init(): void {
    this.initCube();
    this.initPlayCharacter();
  }

  private initCube(): void {
    const cube = this.cube = new Cube();
    this.add(cube);
  }

  private initPlayCharacter(): void {
    const playCharacter = this.playCharacter = new PlayCharacter();
    this.add(playCharacter);
  }
}
