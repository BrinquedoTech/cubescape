import * as THREE from 'three';
import Cube from './Cube/Cube';
import LevelsConfig from '../Configs/LevelsConfig';
import { ILevelConfig, ILevelEdgeConfig, IMapConfig } from '../Interfaces/ILevelConfig';
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
import { ICubeSideAxisConfig } from '../Interfaces/ICubeConfig';
import { CubeSideAxisConfig } from '../Configs/SideConfig';
import { EdgeBySideConfig, EdgesBySideArrayConfig } from '../Configs/EdgeConfig';
import { CubeEdge } from '../Enums/CubeEdge';
import { CubeEdgeOnSidePositionType } from '../Enums/CubeEdgeOnSide';
import ArrayHelper from '../Helpers/ArrayHelper';
import { CellType } from '../Enums/CellType';
import EndLevelObject from './EndLevelObject/EndLevelObject';

export default class GameScene extends THREE.Group {
  private cube: Cube;
  private playerCharacter: PlayerCharacter;
  private endGameObject: EndLevelObject;
  private keyboardController: KeyboardController;
  private levelConfig: ILevelConfig;
  private map: IMapConfig = {};
  private nextCubeRotationDirection: RotateDirection;
  private waitingForCubeRotation: boolean = false;
  private waitingForEndLevel: boolean = false;

  constructor() {
    super();

    this.init();

    this.startLevel(LevelType.Level01);
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

    this.initMap();
    this.cube.init(levelConfig);
    this.playerCharacter.init(levelConfig);
    this.endGameObject.init(levelConfig);
  }

  public rotateCube(rotateDirection: RotateDirection): void {
    this.cube.rotateToDirection(rotateDirection);
  }

  public turnCube(turnDirection: TurnDirection): void {
    this.cube.turn(turnDirection);
  }

  private moveCharacter(moveDirection: MoveDirection): void {
    const currentRotationDirection: CubeRotationDirection = this.cube.getCurrentRotationDirection();
    const newMovingDirection: MoveDirection = MovementDirectionByCubeRotationConfig[moveDirection][currentRotationDirection].direction;
    const playerCharacterGridPosition: THREE.Vector2 = this.playerCharacter.getGridPosition();
    const activeAxis: string = MovementDirectionConfig[newMovingDirection].activeAxis;
    const inactiveAxis: string = activeAxis === 'x' ? 'y' : 'x';
    const sign: number = MovementDirectionConfig[newMovingDirection].vector[activeAxis];
    const startPoint: number = playerCharacterGridPosition[activeAxis];
    const targetGridPosition: THREE.Vector2 = new THREE.Vector2(playerCharacterGridPosition.x, playerCharacterGridPosition.y);

    const cubeSide: CubeSide = this.cube.getCurrentSide();
    const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
    const gridSize: number = activeAxis === 'x' ? this.levelConfig.size[cubeSideAxisConfig.xAxis] : this.levelConfig.size[cubeSideAxisConfig.yAxis];

    if (this.isCellOnEdge(playerCharacterGridPosition.x, playerCharacterGridPosition.y)) {
      for (let i = startPoint + sign; i >= startPoint - 1 && i < startPoint + sign + 1; i += sign) {
        if (i === -2 || i === gridSize + 1) {
          this.waitingForCubeRotation = true;
          this.nextCubeRotationDirection = MovementDirectionByCubeRotationConfig[newMovingDirection][currentRotationDirection].cubeRotationDirection;
          this.rotateCube(this.nextCubeRotationDirection);

          return;
        }
      }
    }

    const nextCellPosition: THREE.Vector2 = new THREE.Vector2();

    for (let i = startPoint + sign; i >= -1 && i < gridSize + 1; i += sign) {
      nextCellPosition[activeAxis] = i;
      nextCellPosition[inactiveAxis] = playerCharacterGridPosition[inactiveAxis];
      const nextCellType: CellType = this.map[cubeSide][nextCellPosition.y + 1][nextCellPosition.x + 1];

      switch (nextCellType) {
        case CellType.Finish:
          targetGridPosition[activeAxis] = i;
          this.waitingForEndLevel = true;
          break;

        case CellType.Empty:
          targetGridPosition[activeAxis] = i;
          continue;
      }

      if (nextCellType === CellType.Wall || nextCellType === CellType.Finish) {
        break;
      }
    }

    if (!GridHelper.isGridCellsEqual(playerCharacterGridPosition, targetGridPosition)) {
      this.playerCharacter.moveToGridCell(targetGridPosition.x, targetGridPosition.y);

      if (this.isCellOnEdge(targetGridPosition.x, targetGridPosition.y)) {
        this.waitingForCubeRotation = true;
        this.nextCubeRotationDirection = MovementDirectionByCubeRotationConfig[newMovingDirection][currentRotationDirection].cubeRotationDirection;
      }
    }
  }

  private isCellOnEdge(cellX: number, cellY: number): boolean {
    const cubeSide: CubeSide = this.cube.getCurrentSide();
    const mapSizeX: number = this.map[cubeSide][0].length;
    const mapSizeY: number = this.map[cubeSide].length;

    return cellX === -1 || cellY === -1 || cellX + 1 === mapSizeX - 1 || cellY + 1 === mapSizeY - 1;
  }

  private initMap(): void {
    this.map = {};

    for (const cubeSide in CubeSide) {
      const side: CubeSide = CubeSide[cubeSide] as CubeSide;
      this.map[side] = this.createFullSideMap(side);
    }
  }

  private createFullSideMap(cubeSide: CubeSide): number[][] {
    const mapSizeX: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].xAxis] + 2;
    const mapSizeY: number = this.levelConfig.size[CubeSideAxisConfig[cubeSide].yAxis] + 2;

    const sideEdgesMap: ILevelEdgeConfig = {};
    const edgesInSide: CubeEdge[] = EdgesBySideArrayConfig[cubeSide];
    for (let i = 0; i < edgesInSide.length; i++) {
      const edge = edgesInSide[i];
      sideEdgesMap[edge] = this.levelConfig.map.edges[edge];
    }

    const resultMap: number[][] = ArrayHelper.create2DArray(mapSizeY, mapSizeX, CellType.Empty);
    ArrayHelper.fillCornerValues(resultMap, CellType.Wall);

    for (const edgeType in sideEdgesMap) {
      const { positionType, direction } = EdgeBySideConfig[cubeSide][edgeType];
      let edgeMap: number[] = [...sideEdgesMap[edgeType]];
      edgeMap = direction === 1 ? edgeMap : edgeMap.reverse();

      switch (positionType) {
        case CubeEdgeOnSidePositionType.Top:
          for (let i = 1; i < mapSizeX - 1; i++)
            resultMap[0][i] = edgeMap[i - 1];
          break;
        case CubeEdgeOnSidePositionType.Down:
          for (let i = 1; i < mapSizeX - 1; i++)
            resultMap[mapSizeY - 1][i] = edgeMap[i - 1];
          break;
        case CubeEdgeOnSidePositionType.Left:
          for (let i = 1; i < mapSizeY - 1; i++)
            resultMap[i][0] = edgeMap[i - 1];
          break;
        case CubeEdgeOnSidePositionType.Right:
          for (let i = 1; i < mapSizeY - 1; i++)
            resultMap[i][mapSizeX - 1] = edgeMap[i - 1];
          break;
      }
    }

    const sideMap: number[][] = this.levelConfig.map.sides[cubeSide];

    for (let i = 1; i < mapSizeY - 1; i++) {
      for (let j = 1; j < mapSizeX - 1; j++) {
        if (sideMap[i - 1][j - 1] === CellType.Wall || sideMap[i - 1][j - 1] === CellType.Finish) {
          resultMap[i][j] = sideMap[i - 1][j - 1];
        }
      }
    }

    return resultMap;
  }

  private init(): void {
    this.initCube();
    this.initPlayerCharacter();
    this.initEndLevelObject();
    this.initKeyboardController();
    this.initSignals();
  }

  private initCube(): void {
    const cube = this.cube = new Cube();
    this.add(cube);
  }

  private initPlayerCharacter(): void {
    const playerCharacter = this.playerCharacter = new PlayerCharacter();
    this.cube.add(playerCharacter);
  }

  private initEndLevelObject(): void {
    const endGameObject = this.endGameObject = new EndLevelObject();
    this.cube.add(endGameObject);
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

  private initSignals(): void {
    this.playerCharacter.emitter.on('onMovingEnd', () => this.onPlayerCharacterMovingEnd());
    this.cube.emitter.on('endRotating', () => this.onCubeRotatingEnd());
  }

  private onPlayerCharacterMovingEnd(): void {
    if (this.waitingForCubeRotation) {
      this.rotateCube(this.nextCubeRotationDirection);
    }

    if (this.waitingForEndLevel) {
      this.waitingForEndLevel = false;
      console.log('End level');
    }
  }

  private onCubeRotatingEnd(): void {
    if (this.waitingForCubeRotation) {
      this.waitingForCubeRotation = false;
      this.nextCubeRotationDirection = null;

      const cubeSide: CubeSide = this.cube.getCurrentSide();
      this.playerCharacter.setActiveSide(cubeSide);
      this.playerCharacter.updatePositionOnRealPosition();
    }
  }
}
