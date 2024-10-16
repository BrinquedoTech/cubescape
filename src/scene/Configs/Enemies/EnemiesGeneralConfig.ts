import { CellType } from '../../Enums/CellType';
import { EnemyType } from '../../Enums/EnemyType';
import Spikes from '../../GameScene/Enemies/EnemyByType/Spikes';

const EnemiesClassName = {
  [EnemyType.Spike]: Spikes,
}

const EnemyCellType: { [key in EnemyType]: CellType } = {
  [EnemyType.Spike]: CellType.Spike,
}

export { EnemiesClassName, EnemyCellType };
