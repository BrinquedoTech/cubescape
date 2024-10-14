import { CellType } from '../Enums/CellType';
import { EnemyType } from '../Enums/EnemyType';
import Spike from '../GameScene/Enemies/EnemyByType/Spike';

const EnemiesClassName = {
  [EnemyType.Spike]: Spike,
}

const EnemyCellType: { [key in EnemyType]: CellType } = {
  [EnemyType.Spike]: CellType.Spike,
}


export { EnemiesClassName, EnemyCellType };
