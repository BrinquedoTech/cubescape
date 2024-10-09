import * as THREE from 'three';
import Cube from './Cube/Cube';
import LevelsConfig from '../Configs/LevelsConfig';
import { ILevelConfig, ILevelEdgeConfig } from '../Interfaces/ILevelConfig';
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
import { EdgeBySideConfig, EdgesBySideArrayConfig } from '../Configs/EdgeConfig';
import { CubeEdge } from '../Enums/CubeEdge';
import { CubeEdgeOnSidePositionType } from '../Enums/CubeEdgeOnSide';

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
    // const gridSize: number = activeAxis === 'x' ? this.levelConfig.size[cubeSurfaceAxisConfig.xAxis] + 2 : this.levelConfig.size[cubeSurfaceAxisConfig.yAxis] + 2;

    const fullMap: number[][] = this.createMapSideWithEdges(cubeSide);

    for (let i = startPoint + sign; i >= -1 && i < gridSize + 1; i += sign) {
      const nextCellX: number = activeAxis === 'x' ? i : playerCharacterGridPosition.x;
      const nextCellY: number = activeAxis === 'y' ? i : playerCharacterGridPosition.y;

      // if (this.isCellAvailable(nextCellX, nextCellY)) {
      if (fullMap[nextCellY + 1][nextCellX + 1] === 0) {
        targetGridPosition[activeAxis] = i;
      } else {
        break;
      }
    }

    if (!GridHelper.isGridCellsEqual(playerCharacterGridPosition, targetGridPosition)) {
      this.playerCharacter.moveToGridCell(targetGridPosition.x, targetGridPosition.y);
    }
  }

  private createMapSideWithEdges(cubeSide: CubeSide): number[][] {
    const resultMap: number[][] = [];

    const mapSizeX: number = this.levelConfig.size[CubeSurfaceAxisConfig[cubeSide].xAxis] + 2;
    const mapSizeY: number = this.levelConfig.size[CubeSurfaceAxisConfig[cubeSide].yAxis] + 2;
    
    const sideMap: number[][] = this.levelConfig.map.surfaces[cubeSide];
    const sideEdgesMap: ILevelEdgeConfig = {};
    const edgesInSide: CubeEdge[] = EdgesBySideArrayConfig[cubeSide];
    for (let i = 0; i < edgesInSide.length; i++) {
      const edge = edgesInSide[i];
      sideEdgesMap[edge] = this.levelConfig.map.edges[edge];
    }


    for (let i = 0; i < mapSizeY; i++) {
      resultMap[i] = new Array(mapSizeX).fill(0);
    }

    const corners: number[][] = [
      [0, 0],
      [0, mapSizeX - 1],
      [mapSizeY - 1, 0],
      [mapSizeY - 1, mapSizeX - 1]
    ];

    corners.forEach(([y, x]) => resultMap[y][x] = 1);
    
    for (const edgeType in sideEdgesMap) {
      const { positionType, direction } = EdgeBySideConfig[cubeSide][edgeType];
      let edgeMap: number[] = [...sideEdgesMap[edgeType]];
      edgeMap = direction === 1 ? edgeMap : edgeMap.reverse();
      
      switch (positionType) {
        case CubeEdgeOnSidePositionType.Top:
          for (let i = 1; i < mapSizeX - 1; i++) {
            resultMap[0][i] = edgeMap[i - 1];
          }
          break;
        case CubeEdgeOnSidePositionType.Down:
          for (let i = 1; i < mapSizeX - 1; i++) {
            resultMap[mapSizeY - 1][i] = edgeMap[i - 1];
          }
          break;
        case CubeEdgeOnSidePositionType.Left:
          for (let i = 1; i < mapSizeY - 1; i++) {
            resultMap[i][0] = edgeMap[i - 1];
          }
          break;
        case CubeEdgeOnSidePositionType.Right:
          for (let i = 1; i < mapSizeY - 1; i++) {
            resultMap[i][mapSizeX - 1] = edgeMap[i - 1];
          }
          break;
      }
    }
     
    for (let i = 0; i < mapSizeY - 2; i++) {
      for (let j = 0; j < mapSizeX - 2; j++) {
        resultMap[i + 1][j + 1] = sideMap[i][j];
      }
    }

    return resultMap;
  }

  // private isCellAvailable(cellX: number, cellY: number): boolean {
  //   const currentSide: CubeSide = this.cube.getCurrentSide();
  //   const sideMap: number[][] = this.levelConfig.map.surfaces[currentSide];

  //   return sideMap[cellY][cellX] === 1 ? false : true;
  // }

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
