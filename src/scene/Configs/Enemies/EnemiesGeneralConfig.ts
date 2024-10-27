import { CellType } from '../../Enums/CellType';
import { EnemyType } from '../../Enums/EnemyType';
import FloorSpikes from '../../GameScene/Enemies/EnemyByType/FloorSpikes';
import WallSpikes from '../../GameScene/Enemies/EnemyByType/WallSpikes';

const EnemiesClassName = {
  [EnemyType.WallSpike]: WallSpikes,
  [EnemyType.FloorSpike]: FloorSpikes,
}

const EnemyCellType: { [key in EnemyType]: CellType } = {
  [EnemyType.WallSpike]: CellType.WallSpike,
  [EnemyType.FloorSpike]: CellType.FloorSpike,
}

export { EnemiesClassName, EnemyCellType };
