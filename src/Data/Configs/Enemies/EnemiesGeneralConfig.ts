import { CellType } from '../../Enums/Cube/CellType';
import { EnemyType } from '../../Enums/Enemy/EnemyType';
import FloorSpikes from '../../../Scene/GameScene/Enemies/EnemyByType/FloorSpikes';
import WallSpikes from '../../../Scene/GameScene/Enemies/EnemyByType/WallSpikes';

const EnemiesClassName = {
  [EnemyType.WallSpike]: WallSpikes,
  [EnemyType.FloorSpike]: FloorSpikes,
}

const EnemyCellType: { [key in EnemyType]: CellType } = {
  [EnemyType.WallSpike]: CellType.WallSpike,
  [EnemyType.FloorSpike]: CellType.FloorSpike,
}

export { EnemiesClassName, EnemyCellType };
