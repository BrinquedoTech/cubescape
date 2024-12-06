import { LevelType } from '../../Enums/LevelType';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import Level01 from './LevelsMap/Level01';
import Level02 from './LevelsMap/Level02';
import Level03 from './LevelsMap/Level03';
import Level04 from './LevelsMap/Level04';
import Level05 from './LevelsMap/Level05';
import Level06 from './LevelsMap/Level06';
import Level07 from './LevelsMap/Level07';
import Level08 from './LevelsMap/Level08';
import Level09 from './LevelsMap/Level09';
import Level10 from './LevelsMap/Level10';
import Level11 from './LevelsMap/Level11';
import Level12 from './LevelsMap/Level12';

const LevelsConfig: { [key in LevelType]?: ILevelConfig } = {
  [LevelType.Level01]: Level01,
  [LevelType.Level02]: Level02,
  [LevelType.Level03]: Level03,
  [LevelType.Level04]: Level04,
  [LevelType.Level05]: Level05,
  [LevelType.Level06]: Level06,
  [LevelType.Level07]: Level07,
  [LevelType.Level08]: Level08,
  [LevelType.Level09]: Level09,
  [LevelType.Level10]: Level10,
  [LevelType.Level11]: Level11,
  [LevelType.Level12]: Level12,
}

const LevelsQueue: LevelType[] = [
  LevelType.Level01,
  LevelType.Level02,
  LevelType.Level03,
  LevelType.Level04,
  LevelType.Level05,
]

export { LevelsConfig, LevelsQueue };
