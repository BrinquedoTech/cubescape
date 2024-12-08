import * as THREE from 'three';
import { ILevelConfig } from '../../../Data/Interfaces/ILevelConfig';
import { EnemyType } from '../../../Data/Enums/Enemy/EnemyType';
import { EnemyConfigMap } from '../../../Data/Interfaces/Enemies/IEnemyConfig';
import { EnemiesClassName, EnemyCellType } from '../../../Data/Configs/Enemies/EnemiesGeneralConfig';
import { ICubePosition, ICubePositionWithID } from '../../../Data/Interfaces/ICubeConfig';
import { CellType } from '../../../Data/Enums/Cube/CellType';
import { CubeSide } from '../../../Data/Enums/Cube/CubeSide';
import FloorSpikes from './EnemyByType/FloorSpikes';
import CubeHelper from '../../../Helpers/CubeHelper';

export default class EnemiesController extends THREE.Group {
  private levelConfig: ILevelConfig;
  private enemies = {};

  constructor() {
    super();

  }

  public update(dt: number): void {
    for (const enemyType in this.enemies) {
      const enemy = this.enemies[enemyType];
      enemy.update(dt);
    }
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.createEnemies();
  }

  public createEnemies(): void {
    if (!this.levelConfig.enemies) {
      return;
    }
    
    const enemiesTypes: string[] = Object.keys(this.levelConfig.enemies);

    for (let i = 0; i < enemiesTypes.length; i++) {
      const enemyType: EnemyType = enemiesTypes[i] as EnemyType;
      const enemies: EnemyConfigMap[EnemyType][] = this.levelConfig.enemies[enemyType] as EnemyConfigMap[EnemyType][];

      const cellType: CellType = EnemyCellType[enemyType];
      const enemyPositions: ICubePositionWithID[] = CubeHelper.getItemWithIDPositions(this.levelConfig.map.sides, cellType);

      const enemyConfigs: EnemyConfigMap[EnemyType][] = [];

      for (let j = 0; j < enemies.length; j++) {
        const enemyConfig: EnemyConfigMap[EnemyType] = enemies[j];
        const enemyPosition: ICubePosition = enemyPositions.filter((position: ICubePositionWithID) => position.id === enemyConfig.id)[0];
        
        if (enemyPosition) {
          enemyConfig.side = enemyPosition.side;
          enemyConfig.position = enemyPosition.gridPosition;
  
          enemyConfigs.push(enemyConfig);
        } else {
          console.warn(`Enemy ${enemyType} with id ${enemyConfig.id} not found`);
        }
      }

      const enemyClass = EnemiesClassName[enemyType];
      const enemy = new enemyClass(enemyConfigs);
      this.add(enemy);
      enemy.init(this.levelConfig);

      this.enemies[enemyType] = enemy;
    }
  }

  public removeEnemies(): void {
    for (const enemyType in this.enemies) {
      const enemy = this.enemies[enemyType];
      enemy.kill();
      this.remove(enemy);
    }

    this.enemies = {};
  }

  public getFloorSpikesBodiesForSide(side: CubeSide): THREE.Mesh[] | null {
    const floorSpikes: FloorSpikes = this.enemies[EnemyType.FloorSpike] as FloorSpikes;

    if (floorSpikes) {
      return floorSpikes.getBodiesForSide(side);
    }

    return null;
  }
}
