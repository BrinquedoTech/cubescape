import * as THREE from 'three';
import Cube from './Cube/Cube';
import LevelsConfig from '../Configs/LevelsConfig';
import { ILevelConfig } from '../Interfaces/ILevelConfig';
import PlayCharacter from './PlayCharacter/PlayCharacter';
import { RotateDirection, TurnDirection } from '../Enums/RotateDirection';
import { KeyboardController } from './KeyboardController';
import { ButtonType } from '../Enums/ButtonType';
import { MoveDirection } from '../Enums/MoveDirection';
import { CubeSide } from '../Enums/CubeSide';
import { CubeRotationDirection } from '../Enums/CubeRotationDirection';
import { MovementDirectionByCubeRotationConfig, MovementDirectionConfig } from '../Configs/CharacterConfig';
import { CubeState } from '../Enums/CubeState';
import { PlayCharacterState } from '../Enums/PlayCharacterState';

export default class GameScene extends THREE.Group {
  private cube: Cube;
  private playCharacter: PlayCharacter;
  private keyboardController: KeyboardController;
  private levelConfig: ILevelConfig;

  constructor() {
    super();

    this.init();

    this.startLevel(0);
  }

  public update(dt: number): void {
    if (this.cube) {
      this.cube.update(dt);
    }

    if (this.playCharacter) {
      this.playCharacter.update(dt);
    }
  }

  private isCellAvailable(cellX: number, cellY: number): boolean {
    const currentSide: CubeSide = this.cube.getCurrentSide();
    const sideMap: number[][] = this.levelConfig.map.surfaces[currentSide];

    return sideMap[cellY][cellX] === 1 ? false : true;
  }

  public startLevel(levelId: number): void {
    const levelConfig: ILevelConfig = this.levelConfig = LevelsConfig[levelId];

    this.cube.init(levelConfig);
    this.playCharacter.init(levelConfig);
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

    const playCharacterGridPosition: THREE.Vector2 = this.playCharacter.getGridPosition();

    const activeAxis: string = MovementDirectionConfig[movingDirection].activeAxis;
    const sign: number = MovementDirectionConfig[movingDirection].vector[activeAxis];
    const startPoint = playCharacterGridPosition[activeAxis];
    const targetGridPosition: THREE.Vector2 = new THREE.Vector2(playCharacterGridPosition.x, playCharacterGridPosition.y);

    for (let i = startPoint + sign; i >= 0 && i < this.levelConfig.size; i += sign) {
      const nextCellX: number = activeAxis === 'x' ? i : playCharacterGridPosition.x;
      const nextCellY: number = activeAxis === 'y' ? i : playCharacterGridPosition.y;

      if (this.isCellAvailable(nextCellX, nextCellY)) {
        targetGridPosition[activeAxis] = i;
      } else {
        break;
      }
    }

    if (!this.isGridCellsEqual(playCharacterGridPosition, targetGridPosition)) {
      this.playCharacter.moveToGridCell(targetGridPosition.x, targetGridPosition.y);
    }
  }

  private isGridCellsEqual(cell1Position: THREE.Vector2, cell2Position: THREE.Vector2): boolean {
    return cell1Position.x === cell2Position.x && cell1Position.y === cell2Position.y;
  }

  private init(): void {
    this.initCube();
    this.initPlayCharacter();
    this.initKeyboardController();
  }

  private initCube(): void {
    const cube = this.cube = new Cube();
    this.add(cube);
  }

  private initPlayCharacter(): void {
    const playCharacter = this.playCharacter = new PlayCharacter();
    this.cube.add(playCharacter);
  }

  private initKeyboardController(): void {
    this.keyboardController = new KeyboardController();

    this.keyboardController.emitter.on('onButtonPress', (buttonType: ButtonType) => {
      this.onButtonPress(buttonType);
    });
  }

  private onButtonPress(buttonType: ButtonType): void {
    const directionConfig: { [key in ButtonType]: MoveDirection } = {
      [ButtonType.Right]: MoveDirection.Right,
      [ButtonType.Left]: MoveDirection.Left,
      [ButtonType.Up]: MoveDirection.Up,
      [ButtonType.Down]: MoveDirection.Down,
    };

    const moveDirection: MoveDirection = directionConfig[buttonType];

    if (this.cube.getState() === CubeState.Idle && this.playCharacter.getState() === PlayCharacterState.Idle) {
      this.moveCharacter(moveDirection);
    }
  }
}
