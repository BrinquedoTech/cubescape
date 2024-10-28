import * as THREE from 'three';
import Cube from './Cube/Cube';
import { LevelsConfig, LevelsQueue } from '../Configs/LevelsConfig';
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
import CubeHelper from '../Helpers/CubeHelper';
import { LevelType } from '../Enums/LevelType';
import { ICubeSideAxisConfig } from '../Interfaces/ICubeConfig';
import { CubeSideAxisConfig } from '../Configs/SideConfig';
import { CellType } from '../Enums/CellType';
import FinishLevelObject from './FinishLevelObject/FinishLevelObject';
import MapController from './MapController';
import { CameraController } from './CameraController';
import EnemiesController from './Enemies/EnemiesController';
import { CellsWithBody } from '../Configs/Cells/CellsConfig';
import { IWallSpikeConfig } from '../Interfaces/IEnemyConfig';
import { GameState } from '../Enums/GameState';
import mitt, { Emitter } from 'mitt';
import { LightController } from './LightController';
import Coins from './Coins/Coins';

type Events = {
  onWinLevel: string;
  onPressStart: string;
};

export default class GameScene extends THREE.Group {
  private cube: Cube;
  private playerCharacter: PlayerCharacter;
  private finishLevelObject: FinishLevelObject;
  private keyboardController: KeyboardController;
  private mapController: MapController;
  private cameraController: CameraController;
  private enemiesController: EnemiesController;
  private coins: Coins;

  private camera: THREE.PerspectiveCamera;
  private state: GameState = GameState.Paused;
  private isIntroActive: boolean = false;

  private levelConfig: ILevelConfig;
  private levelIndex: number = 0;
  private nextCubeRotationDirection: RotateDirection = null;
  private currentMoveDirection: MoveDirection = null;
  private waitingForCubeRotation: boolean = false;
  private waitingForEndLevel: boolean = false;
  private nextMoveDirection: MoveDirection = null;
  private wallSpikeOnTargetPosition: string = '';

  public emitter: Emitter<Events> = mitt<Events>();

  constructor(camera: THREE.PerspectiveCamera) {
    super();

    this.camera = camera;

    this.init();
  }

  public update(dt: number): void {
    this.cube.update(dt);
    this.playerCharacter.update(dt);
    this.cameraController.update(dt);
    this.finishLevelObject.update(dt);
    this.enemiesController.update(dt);
    this.coins.update(dt);

    this.updateCollisions();
  }

  private updateCollisions(): void {
    if (this.playerCharacter.isActivated()) {
      this.updateCoinsCollisions();
      this.updateFloorSpikesCollisions();
    }
  }

  private updateCoinsCollisions(): void {
    const playerCharacterBody: THREE.Mesh = this.playerCharacter.getBody();
    const currentSide: CubeSide = this.cube.getCurrentSide();
    const coinsBodies: THREE.Mesh[] = this.coins.getBodiesForSide(currentSide);

    if (coinsBodies.length > 0) {
      for (let i = 0; i < coinsBodies.length; i++) {
        const coinBody: THREE.Mesh = coinsBodies[i];
  
        if (coinBody.userData.config.isActive && playerCharacterBody.userData.obb.intersectsOBB(coinBody.userData.obb)) {
          const id: number = coinBody.userData.config.instanceId;
          this.coins.hideCoin(id);
          this.coins.deactivateCoin(id);
        }
      }
    }
  }

  private updateFloorSpikesCollisions(): void {
    const playerCharacterBody: THREE.Mesh = this.playerCharacter.getBody();
    const currentSide: CubeSide = this.cube.getCurrentSide();
    const floorSpikesBodies: THREE.Mesh[] = this.enemiesController.getFloorSpikesBodiesForSide(currentSide);

    if (floorSpikesBodies && floorSpikesBodies.length > 0) {
      for (let i = 0; i < floorSpikesBodies.length; i++) {
        const floorSpikeBody: THREE.Mesh = floorSpikesBodies[i];

        if (floorSpikeBody.userData.config.isActive && playerCharacterBody.userData.obb.intersectsOBB(floorSpikeBody.userData.obb)) {
          console.log('Death');
          this.playerCharacter.death();
        }
      }
    }
  }

  public startGame(): void {
    this.cube.stopIntroAnimation();
  }

  public startIntro(): void {
    this.isIntroActive = true;
    const currentLevelType: LevelType = LevelsQueue[this.levelIndex];
    this.createLevel(currentLevelType);

    this.playerCharacter.hide();
    this.cube.hide();

    setTimeout(() => {
      this.cube.showStartLevelAnimation();
    }, 100);
  }

  public startGameWithoutIntro(): void {
    const currentLevelType: LevelType = LevelsQueue[this.levelIndex];
    this.createLevel(currentLevelType);
    this.activateGame();
  }

  public createLevel(levelType: LevelType): void {
    const levelConfig: ILevelConfig = this.levelConfig = LevelsConfig[levelType];

    this.mapController.init(levelConfig);
    this.cube.init(levelConfig);
    this.playerCharacter.init(levelConfig);
    this.finishLevelObject.init(levelConfig);
    this.enemiesController.init(levelConfig);
    this.coins.init(levelConfig);
  }

  public rotateCube(rotateDirection: RotateDirection): void {
    this.cube.rotateToDirection(rotateDirection);
  }

  public turnCube(turnDirection: TurnDirection): void {
    this.cube.turn(turnDirection);
  }

  public startNextLevel(): void {
    this.cube.winLevelAnimation();
  }

  private activateGame(): void {
    this.state = GameState.Active;
    this.playerCharacter.showAnimation();
    this.coins.activateCoins();
  }

  private moveCharacter(moveDirection: MoveDirection): void {
    this.currentMoveDirection = moveDirection;
    const currentRotationDirection: CubeRotationDirection = this.cube.getCurrentRotationDirection();
    const movingDirection: MoveDirection = MovementDirectionByCubeRotationConfig[moveDirection][currentRotationDirection].direction;
    const playerCharacterGridPosition: THREE.Vector2 = this.playerCharacter.getGridPosition();
    const activeAxis: string = MovementDirectionConfig[movingDirection].activeAxis;
    const sign: number = MovementDirectionConfig[movingDirection].vector[activeAxis];
    const startPoint: number = playerCharacterGridPosition[activeAxis];

    const cubeSide: CubeSide = this.cube.getCurrentSide();
    const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[cubeSide];
    const gridSize: number = activeAxis === 'x' ? this.levelConfig.size[cubeSideAxisConfig.xAxis] : this.levelConfig.size[cubeSideAxisConfig.yAxis];

    if (this.checkOnEdgeMovingBack(startPoint, sign, gridSize)) {
      this.waitingForCubeRotation = true;
      this.nextCubeRotationDirection = MovementDirectionByCubeRotationConfig[movingDirection][currentRotationDirection].cubeRotationDirection;
      this.rotateCube(this.nextCubeRotationDirection);

      return;
    }

    const targetGridPosition: THREE.Vector2 = this.getMovingTargetGridPosition(startPoint, sign, gridSize, movingDirection);

    if (!CubeHelper.isGridCellsEqual(playerCharacterGridPosition, targetGridPosition)) {
      this.playerCharacter.setMovingDirection(movingDirection);
      this.playerCharacter.moveToGridCell(targetGridPosition.x, targetGridPosition.y);

      if (this.isCellOnEdge(targetGridPosition.x, targetGridPosition.y)) {
        this.waitingForCubeRotation = true;
        this.nextCubeRotationDirection = MovementDirectionByCubeRotationConfig[movingDirection][currentRotationDirection].cubeRotationDirection;
      }
    }

    this.playerCharacter.setRotationByDirection(movingDirection);
  }

  private checkOnEdgeMovingBack(startPoint: number, sign: number, gridSize: number): boolean {
    const playerCharacterGridPosition: THREE.Vector2 = this.playerCharacter.getGridPosition();

    if (this.isCellOnEdge(playerCharacterGridPosition.x, playerCharacterGridPosition.y)) {
      for (let i = startPoint + sign; i >= startPoint - 1 && i < startPoint + sign + 1; i += sign) {
        if (i === -2 || i === gridSize + 1) {
          return true;
        }
      }
    }

    return false;
  }

  private getMovingTargetGridPosition(startPoint: number, sign: number, gridSize: number, newMovingDirection: MoveDirection): THREE.Vector2 {
    const playerCharacterGridPosition: THREE.Vector2 = this.playerCharacter.getGridPosition();
    const targetGridPosition: THREE.Vector2 = new THREE.Vector2(playerCharacterGridPosition.x, playerCharacterGridPosition.y);
    const nextCellPosition: THREE.Vector2 = new THREE.Vector2();

    const activeAxis: string = MovementDirectionConfig[newMovingDirection].activeAxis;
    const inactiveAxis: string = activeAxis === 'x' ? 'y' : 'x';
    const cubeSide: CubeSide = this.cube.getCurrentSide();

    for (let i = startPoint + sign; i >= -1 && i < gridSize + 1; i += sign) {
      nextCellPosition[activeAxis] = i;
      nextCellPosition[inactiveAxis] = playerCharacterGridPosition[inactiveAxis];
      const nextCellSymbol: string = this.mapController.getCellSymbol(cubeSide, nextCellPosition.x + 1, nextCellPosition.y + 1);
      const nextCellType: CellType = CubeHelper.getCellTypeBySymbol(nextCellSymbol);

      switch (nextCellType) {
        case CellType.Finish:
          targetGridPosition[activeAxis] = i;
          this.waitingForEndLevel = true;
          break;

        case CellType.WallSpike:
          this.wallSpikeOnTargetPosition = nextCellSymbol;
          break;

        case CellType.Empty:
          targetGridPosition[activeAxis] = i;
          continue;
      }

      if (CellsWithBody.includes(nextCellType)) {
        break;
      }
    }

    return targetGridPosition;
  }

  private isCellOnEdge(cellX: number, cellY: number): boolean {
    const cubeSide: CubeSide = this.cube.getCurrentSide();
    const mapSize: THREE.Vector2 = this.mapController.getMapSize(cubeSide);

    return cellX === -1 || cellY === -1 || cellX === mapSize.x - 2 || cellY === mapSize.y - 2;
  }

  private init(): void {
    this.initMapController();
    
    this.initCube();
    this.initPlayerCharacter();
    this.initFinishLevelObject();
    this.initEnemiesController();
    this.initLightController();
    this.initCoinsController();
    
    this.initKeyboardController();
    this.initCameraController();

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

  private initFinishLevelObject(): void {
    const finishGameObject = this.finishLevelObject = new FinishLevelObject();
    this.cube.add(finishGameObject);
  }

  private initMapController(): void {
    this.mapController = new MapController();
  }

  private initEnemiesController(): void {
    const enemiesController = this.enemiesController = new EnemiesController();
    this.cube.add(enemiesController);
  }

  private initLightController(): void {
    const lightController = new LightController();
    this.add(lightController);

    lightController.addPlayerCharacter(this.playerCharacter);
  }

  private initCoinsController(): void {
    const coins = this.coins = new Coins();
    this.cube.add(coins);
  }

  private initCameraController(): void {
    this.cameraController = new CameraController(this.camera);
    this.cameraController.setPlayerCharacter(this.playerCharacter);
    this.cameraController.setCube(this.cube);
  }

  private initKeyboardController(): void {
    this.keyboardController = new KeyboardController();

    this.keyboardController.emitter.on('onButtonPress', (buttonType: ButtonType) => {
      this.onButtonPress(buttonType);
    });
  }

  private onButtonPress(buttonType: ButtonType): void {
    if (buttonType === ButtonType.Start) {
      this.emitter.emit('onPressStart');
    }

    if (!this.playerCharacter.isActivated() || this.state === GameState.Paused) {
      return;
    }
    
    const moveDirection: MoveDirection = MovementDirectionByButtonConfig[buttonType];

    if (moveDirection) {
      if ((this.cube.getState() === CubeState.Rotating || this.playerCharacter.getState() === PlayerCharacterState.Moving) && this.nextMoveDirection === null) {
        this.nextMoveDirection = moveDirection;
      }
  
      if (this.cube.getState() === CubeState.Idle && this.playerCharacter.getState() === PlayerCharacterState.Idle) {
        this.moveCharacter(moveDirection);
      }
    }
  }

  private initSignals(): void {
    this.playerCharacter.emitter.on('onMovingEnd', () => this.onPlayerCharacterMovingEnd());
    this.playerCharacter.emitter.on('onDeathAnimationEnd', () => this.resetLevelOnDeath());
    this.cube.emitter.on('endRotating', () => this.onCubeRotatingEnd());
    this.cube.emitter.on('endRotatingOnRespawn', () => this.respawnPlayerCharacter());
    this.cube.emitter.on('winAnimationEnd', () => this.onCubeWinLevelAnimationEnd());
    this.cube.emitter.on('startLevelAnimationEnd', () => this.onCubeStartLevelAnimationEnd());
    this.cube.emitter.on('endIntroRotation', () => this.endIntroRotation());
  }

  private endIntroRotation(): void {
    this.isIntroActive = false;
    this.activateGame();
  }

  private onPlayerCharacterMovingEnd(): void {
    if (this.waitingForEndLevel) {
      this.waitingForEndLevel = false;
      this.onLevelEnd();
      return;
    }

    if (this.wallSpikeOnTargetPosition) {
      const wallSpikeConfig: IWallSpikeConfig = CubeHelper.getEnemyConfigBySymbol(this.levelConfig, this.wallSpikeOnTargetPosition) as unknown as IWallSpikeConfig;
      const dangerCells: THREE.Vector2[] = CubeHelper.getDangerCellsForWallSpike(wallSpikeConfig);
      const playerCharacterGridPosition: THREE.Vector2 = this.playerCharacter.getGridPosition();
      this.wallSpikeOnTargetPosition = '';

      if (dangerCells.some((dangerCell: THREE.Vector2) => CubeHelper.isGridCellsEqual(dangerCell, playerCharacterGridPosition))) {
        this.playerCharacter.death();
      
        return;
      }
    }

    if (this.waitingForCubeRotation) {
      this.rotateCube(this.nextCubeRotationDirection);
    }

    if (this.nextMoveDirection && !this.waitingForCubeRotation) {
      this.moveCharacter(this.nextMoveDirection);
      this.nextMoveDirection = null;
    }
  }

  private onCubeRotatingEnd(): void {
    if (this.waitingForCubeRotation) {
      this.waitingForCubeRotation = false;
      this.nextCubeRotationDirection = null;

      const cubeSide: CubeSide = this.cube.getCurrentSide();
      this.playerCharacter.setActiveSide(cubeSide);
      this.playerCharacter.updatePositionOnRealPosition();
      this.playerCharacter.setRotationBySide(cubeSide);

      if (this.nextMoveDirection) {
        this.moveCharacter(this.nextMoveDirection);
        this.nextMoveDirection = null;
      }

      const currentRotationDirection: CubeRotationDirection = this.cube.getCurrentRotationDirection();
      const movingDirection: MoveDirection = MovementDirectionByCubeRotationConfig[this.currentMoveDirection][currentRotationDirection].direction;
      this.playerCharacter.setRotationByDirection(movingDirection);
    }
  }

  private onLevelEnd(): void {
    this.state = GameState.Paused;
    this.playerCharacter.setActiveState(false);

    this.playerCharacter.hideAnimation();

    this.emitter.emit('onWinLevel');
  }

  private onCubeWinLevelAnimationEnd(): void {
    this.reset();
    this.removeLevel();
    this.hideLevel();
    
    this.createNextLevel();
  }

  private onCubeStartLevelAnimationEnd(): void {
    if (this.isIntroActive) {
      this.cube.startIntroAnimation();
      return;
    }

    this.activateGame();
  }

  private reset(): void {
    this.waitingForCubeRotation = false;
    this.waitingForEndLevel = false;
    this.nextMoveDirection = null;
    this.nextCubeRotationDirection = null;
    this.wallSpikeOnTargetPosition = '';
    this.currentMoveDirection = null;
  }

  private removeLevel(): void {
    this.playerCharacter.reset();
    this.cube.reset();
    this.cube.removeCube();
    this.enemiesController.removeEnemies();
    this.coins.removeCoins();
  }

  private hideLevel(): void {
    this.playerCharacter.hide();
    this.finishLevelObject.hide();
    this.cube.hide();
  }

  private createNextLevel(): void {
    this.levelIndex++;

    if (this.levelIndex < LevelsQueue.length) {
      const currentLevelType: LevelType = LevelsQueue[this.levelIndex];
      this.createLevel(currentLevelType);
      this.cube.showStartLevelAnimation();
    }
  }

  private resetLevelOnDeath(): void {
    this.reset();
    this.coins.respawnCoins();
    this.cube.rotateToStartSide();
  }

  private respawnPlayerCharacter(): void {
    this.playerCharacter.respawn();
  }
}
