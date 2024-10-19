import { CellType } from '../../Enums/CellType';
import { EnemyType } from '../../Enums/EnemyType';
import WallSpikes from '../../GameScene/Enemies/EnemyByType/WallSpikes';

const EnemiesClassName = {
  [EnemyType.WallSpike]: WallSpikes,
}

const EnemyCellType: { [key in EnemyType]: CellType } = {
  [EnemyType.WallSpike]: CellType.WallSpike,
}

export { EnemiesClassName, EnemyCellType };
