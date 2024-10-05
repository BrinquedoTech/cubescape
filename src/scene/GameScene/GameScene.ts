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
import GameplayConfig from '../Configs/GameplayConfig';

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
    if (this.playCharacter.getState() === PlayCharacterState.Moving) {
      const speed: number = 20;
      const distance: number = speed * dt;

      const surfacePosition: THREE.Vector2 = this.playCharacter.getSurfacePosition();
      const movingDirection: MoveDirection = this.playCharacter.getMovingDirection();

      const newX: number = surfacePosition.x + MovementDirectionConfig[movingDirection].vector.x * distance;
      const newY: number = surfacePosition.y + MovementDirectionConfig[movingDirection].vector.y * distance;

      if (distance > GameplayConfig.gridSize * 0.5) {
        this.playCharacter.setIsCrossedCellCenter(false);
      }

      if (this.playCharacter.isCrossedCenterGridCell(newX, newY) && !this.playCharacter.getIsCrossedCellCenter()) {
        this.playCharacter.setIsCrossedCellCenter(true);

        const playCharacterGridPosition: THREE.Vector2 = this.playCharacter.getGridPosition();

        if (!this.isNextCellAvailable(playCharacterGridPosition.x, playCharacterGridPosition.y, movingDirection)) {
          this.playCharacter.stopMoving();
          this.playCharacter.setIsCrossedCellCenter(false);
          // this.playCharacter.setGridPositionOnActiveSurface(playCharacterGridPosition.x, playCharacterGridPosition.y);
        }
      } else {
        this.playCharacter.setPositionOnActiveSurface(newX, newY);
      }
    }

    if (this.cube) {
      this.cube.update(dt);
    }

    if (this.playCharacter) {
      this.playCharacter.update(dt);
    }
  }

  private isNextCellAvailable(startCellX: number, startCellY: number, movingDirection: MoveDirection): boolean {
    const currentSide: CubeSide = this.cube.getCurrentSide();
    const sideMap: number[][] = this.levelConfig.map.surfaces[currentSide];

    const targetGridPosition = new THREE.Vector2(
      startCellX + MovementDirectionConfig[movingDirection].vector.x,
      startCellY + MovementDirectionConfig[movingDirection].vector.y,
    );
    
    if (targetGridPosition.x < 0 || targetGridPosition.x >= this.levelConfig.size || targetGridPosition.y < 0 || targetGridPosition.y >= this.levelConfig.size) {
      return false;
    }

    if (sideMap[targetGridPosition.y][targetGridPosition.x] === 1) {
      return false
    }

    return true;
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
    const currentSide: CubeSide = this.cube.getCurrentSide();
    const currentRotationDirection: CubeRotationDirection = this.cube.getCurrentRotationDirection();
    const sideMap: number[][] = this.levelConfig.map.surfaces[currentSide];

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

    if (!this.isCellsEqual(playCharacterGridPosition, targetGridPosition)) {
      this.playCharacter.setGridPositionOnActiveSurface(targetGridPosition.x, targetGridPosition.y);
    }

  }

  private isCellsEqual(cell1: THREE.Vector2, cell2: THREE.Vector2): boolean {
    return cell1.x === cell2.x && cell1.y === cell2.y;
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
