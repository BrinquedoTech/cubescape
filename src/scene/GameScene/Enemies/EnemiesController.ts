import * as THREE from 'three';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { EnemyType } from '../../Enums/EnemyType';
import { EnemyConfigMap } from '../../Interfaces/IEnemyConfig';
import { EnemiesClassName, EnemyCellType } from '../../Configs/EnemiesConfig';
import { ICubePosition, ICubePositionWithID } from '../../Interfaces/ICubeConfig';
import GridHelper from '../../Helpers/GridHelper';
import { CellType } from '../../Enums/CellType';

type EnemyClass = new (config: EnemyConfigMap[EnemyType]) => THREE.Object3D;

export default class EnemiesController extends THREE.Group {
  private levelConfig: ILevelConfig;

  constructor() {
    super();

  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.createEnemies();
  }

  public createEnemies(): void {
    const enemiesTypes: string[] = Object.keys(this.levelConfig.enemies);

    for (let i = 0; i < enemiesTypes.length; i++) {
      const enemyType: EnemyType = enemiesTypes[i] as EnemyType;
      const enemies: EnemyConfigMap[EnemyType][] = this.levelConfig.enemies[enemyType] as EnemyConfigMap[EnemyType][];

      const cellType: CellType = EnemyCellType[enemyType];
      const enemyPositions: ICubePositionWithID[] = GridHelper.getItemWithIDPositions(this.levelConfig.map.sides, cellType);

      for (let j = 0; j < enemies.length; j++) {
        const enemyConfig: EnemyConfigMap[EnemyType] = enemies[j];
        const enemyPosition: ICubePosition = enemyPositions.filter((position: ICubePositionWithID) => position.id === enemyConfig.id)[0];
        
        if (enemyPosition) {
          enemyConfig.side = enemyPosition.side;
          enemyConfig.position = enemyPosition.gridPosition;
  
          const enemyClass: EnemyClass = EnemiesClassName[enemyType];
          const enemy: THREE.Object3D = new enemyClass(enemyConfig);
          this.add(enemy);
        } else {
          console.warn(`Enemy ${enemyType} with id ${enemyConfig.id} not found`);
        }
      }
    }
  }

}
