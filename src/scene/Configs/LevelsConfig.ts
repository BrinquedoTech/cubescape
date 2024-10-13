import { LevelType } from '../Enums/LevelType';
import { ILevelConfig } from '../Interfaces/ILevelConfig';
import Level01 from './Levels/Level01';
import Level02 from './Levels/Level02';

const LevelsConfig: { [key in LevelType]?: ILevelConfig } = {
  [LevelType.Level01]: Level01,
  [LevelType.Level02]: Level02,
}

const LevelsQueue: LevelType[] = [
  LevelType.Level01,
  LevelType.Level02,
]

export { LevelsConfig, LevelsQueue };
