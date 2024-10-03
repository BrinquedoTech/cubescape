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
    const surfacePosition: THREE.Vector2 = this.playCharacter.getSurfacePosition();

    let targetPosition: THREE.Vector2;

    const moveDirectionConfig = {
      [MoveDirection.Right]: {
        [CubeRotationDirection.Top]: { x: 1, y: 0 },
        [CubeRotationDirection.Bottom]: { x: -1, y: 0 },
        [CubeRotationDirection.Right]: { x: 0, y: 1 },
        [CubeRotationDirection.Left]: { x: 0, y: -1 },
      },
      [MoveDirection.Left]: {
        [CubeRotationDirection.Top]: { x: -1, y: 0 },
        [CubeRotationDirection.Bottom]: { x: 1, y: 0 },
        [CubeRotationDirection.Right]: { x: 0, y: -1 },
        [CubeRotationDirection.Left]: { x: 0, y: 1 },
      },
      [MoveDirection.Up]: {
        [CubeRotationDirection.Top]: { x: 0, y: -1 },
        [CubeRotationDirection.Bottom]: { x: 0, y: 1 },
        [CubeRotationDirection.Right]: { x: 1, y: 0 },
        [CubeRotationDirection.Left]: { x: -1, y: 0 },
      },
      [MoveDirection.Down]: {
        [CubeRotationDirection.Top]: { x: 0, y: 1 },
        [CubeRotationDirection.Bottom]: { x: 0, y: -1 },
        [CubeRotationDirection.Right]: { x: -1, y: 0 },
        [CubeRotationDirection.Left]: { x: 1, y: 0 },
      },
    }

    targetPosition = new THREE.Vector2(
      surfacePosition.x + moveDirectionConfig[moveDirection][currentRotationDirection].x,
      surfacePosition.y + moveDirectionConfig[moveDirection][currentRotationDirection].y,
    );

    if (targetPosition.x < 0 || targetPosition.x >= this.levelConfig.size || targetPosition.y < 0 || targetPosition.y >= this.levelConfig.size) {
      return;
    }

    this.playCharacter.move(targetPosition.x, targetPosition.y);
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
    this.moveCharacter(moveDirection);
  }
}
