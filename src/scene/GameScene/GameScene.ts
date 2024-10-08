import * as THREE from 'three';
import Cube from './Cube/Cube';
import LevelsConfig from '../Configs/LevelsConfig';
import { ILevelConfig } from '../Interfaces/ILevelConfig';
import PlayerCharacter from './PlayerCharacter/PlayerCharacter';
import { RotateDirection, TurnDirection } from '../Enums/RotateDirection';
import { KeyboardController } from './KeyboardController';
import { ButtonType } from '../Enums/ButtonType';
import { MoveDirection } from '../Enums/MoveDirection';
import { CubeSide } from '../Enums/CubeSide';
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';
import { MovementDirectionByButtonConfig, MovementDirectionByCubeRotationConfig, MovementDirectionConfig } from '../Configs/PlayerCharacterConfig';
import { CubeState } from '../Enums/CubeState';
import { PlayerCharacterState } from '../Enums/PlayerCharacterState';
import GridHelper from '../Helpers/GridHelper';
import { LevelType } from '../Enums/LevelType';
import { ICubeSurfaceAxisConfig } from '../Interfaces/ICubeConfig';
import { CubeSurfaceAxisConfig } from '../Configs/SurfaceConfig';

export default class GameScene extends THREE.Group {
  private cube: Cube;
  private playerCharacter: PlayerCharacter;
  private keyboardController: KeyboardController;
  private levelConfig: ILevelConfig;

  constructor() {
    super();

    this.init();

    this.startLevel(LevelType.Level02);
  }

  public update(dt: number): void {
    if (this.cube) {
      this.cube.update(dt);
    }

    if (this.playerCharacter) {
      this.playerCharacter.update(dt);
    }
  }

  public startLevel(levelType: LevelType): void {
    const levelConfig: ILevelConfig = this.levelConfig = LevelsConfig[levelType];

    this.cube.init(levelConfig);
    this.playerCharacter.init(levelConfig);
  }

  public rotateCube(rotateDirection: RotateDirection): void {
    this.cube.rotateToDirection(rotateDirection);
  }

  public turnCube(turnDirection: TurnDirection): void {
    this.cube.turn(turnDirection);
  }

  private moveCharacter(moveDirection: MoveDirection): void {
    const currentRotationDirection: CubeRotationDirection = this.cube.getCurrentRotationDirection();
    const movingDirection: MoveDirection = MovementDirectionByCubeRotationConfig[moveDirection][currentRotationDirection].direction;
    const playerCharacterGridPosition: THREE.Vector2 = this.playerCharacter.getGridPosition();
    const activeAxis: string = MovementDirectionConfig[movingDirection].activeAxis;
    const sign: number = MovementDirectionConfig[movingDirection].vector[activeAxis];
    const startPoint: number = playerCharacterGridPosition[activeAxis];
    const targetGridPosition: THREE.Vector2 = new THREE.Vector2(playerCharacterGridPosition.x, playerCharacterGridPosition.y);

    const cubeSide: CubeSide = this.cube.getCurrentSide();
    const cubeSurfaceAxisConfig: ICubeSurfaceAxisConfig = CubeSurfaceAxisConfig[cubeSide];
    const gridSize: number = activeAxis === 'x' ? this.levelConfig.size[cubeSurfaceAxisConfig.xAxis] : this.levelConfig.size[cubeSurfaceAxisConfig.yAxis];

    for (let i = startPoint + sign; i >= 0 && i < gridSize; i += sign) {
      const nextCellX: number = activeAxis === 'x' ? i : playerCharacterGridPosition.x;
      const nextCellY: number = activeAxis === 'y' ? i : playerCharacterGridPosition.y;

      if (this.isCellAvailable(nextCellX, nextCellY)) {
        targetGridPosition[activeAxis] = i;
      } else {
        break;
      }
    }

    if (!GridHelper.isGridCellsEqual(playerCharacterGridPosition, targetGridPosition)) {
      this.playerCharacter.moveToGridCell(targetGridPosition.x, targetGridPosition.y);
    }
  }

  private isCellAvailable(cellX: number, cellY: number): boolean {
    const currentSide: CubeSide = this.cube.getCurrentSide();
    const sideMap: number[][] = this.levelConfig.map.surfaces[currentSide];

    return sideMap[cellY][cellX] === 1 ? false : true;
  }

  private init(): void {
    this.initCube();
    this.initPlayerCharacter();
    this.initKeyboardController();
  }

  private initCube(): void {
    const cube = this.cube = new Cube();
    this.add(cube);
  }

  private initPlayerCharacter(): void {
    const playerCharacter = this.playerCharacter = new PlayerCharacter();
    this.cube.add(playerCharacter);
  }

  private initKeyboardController(): void {
    this.keyboardController = new KeyboardController();

    this.keyboardController.emitter.on('onButtonPress', (buttonType: ButtonType) => {
      this.onButtonPress(buttonType);
    });
  }

  private onButtonPress(buttonType: ButtonType): void {
    const moveDirection: MoveDirection = MovementDirectionByButtonConfig[buttonType];

    if (this.cube.getState() === CubeState.Idle && this.playerCharacter.getState() === PlayerCharacterState.Idle) {
      this.moveCharacter(moveDirection);
    }
  }
}
