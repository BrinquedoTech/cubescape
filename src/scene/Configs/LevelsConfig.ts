import { LevelType } from '../Enums/LevelType';
import { ILevelConfig } from '../Interfaces/ILevelConfig';
import Level01 from './Levels/Level01';
import Level02 from './Levels/Level02';
import Level03 from './Levels/Level03';
import Level04 from './Levels/Level04';
import Level05 from './Levels/Level05';

const LevelsConfig: { [key in LevelType]?: ILevelConfig } = {
  [LevelType.Level01]: Level01,
  [LevelType.Level02]: Level02,
  [LevelType.Level03]: Level03,
  [LevelType.Level04]: Level04,
  [LevelType.Level05]: Level05,
}

const LevelsQueue: LevelType[] = [
  LevelType.Level02,
  LevelType.Level02,
]

export { LevelsConfig, LevelsQueue };
