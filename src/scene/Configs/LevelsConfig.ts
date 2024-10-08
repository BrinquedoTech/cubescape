import { LevelType } from '../Enums/LevelType';
import { ILevelConfig } from '../Interfaces/ILevelConfig';
import Level02 from './Levels/Level01';
import Level01 from './Levels/Level01';

const LevelsConfig: { [key in LevelType]?: ILevelConfig } = {
  [LevelType.Level01]: Level01,
  [LevelType.Level02]: Level02,
}

export default LevelsConfig;
