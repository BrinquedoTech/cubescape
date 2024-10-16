import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { EnemyType } from '../../Enums/EnemyType';
import { EnemyConfigMap } from '../../Interfaces/IEnemyConfig';
import { EnemiesClassName, EnemyCellType } from '../../Configs/Enemies/EnemiesGeneralConfig';
import { ICubePosition, ICubePositionWithID } from '../../Interfaces/ICubeConfig';
import CubeHelper from '../../Helpers/CubeHelper';
import { CellType } from '../../Enums/CellType';

export default class EnemiesController extends THREE.Group {
  private levelConfig: ILevelConfig;
  private enemies = {};

  constructor() {
    super();

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
}
