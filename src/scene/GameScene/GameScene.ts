import * as THREE from 'three';
import Cube from './Cube/Cube';
import LevelsConfig from '../Configs/LevelsConfig';
import { ILevelConfig } from '../Interfaces/ILevelConfig';
import PlayCharacter from './PlayCharacter/PlayCharacter';
import { RotateDirection, TurnDirection } from '../Enums/RotateDirection';

export default class GameScene extends THREE.Group {
  private cube: Cube;
  private playCharacter: PlayCharacter;

  constructor() {
    super();

    this.init();

    this.startLevel(0);
  }

  public update(dt: number): void {
    if (this.cube) {
      this.cube.update(dt);
    }
  }

  public startLevel(levelId: number): void {
    const levelConfig: ILevelConfig = LevelsConfig[levelId];

    this.cube.init(levelConfig);
    this.playCharacter.init(levelConfig);
  }

  public rotateCube(rotateDirection: RotateDirection): void {
    this.cube.rotateToDirection(rotateDirection);
  }

  public turnCube(turnDirection: TurnDirection): void {
    this.cube.turn(turnDirection);
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
    this.cube.add(playCharacter);
  }
}
