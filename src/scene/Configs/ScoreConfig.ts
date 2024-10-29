import { LevelType } from "../Enums/LevelType";

const ScoreConfig = {
  coin: 10,
  allCoinsBonus: 100,
  bonusForSecond: 10,
  timeForLevel: {
    [LevelType.Level01]: 30,
    [LevelType.Level02]: 30,
    [LevelType.Level03]: 30,
    [LevelType.Level04]: 30,
    [LevelType.Level05]: 30,
  }
}

export { ScoreConfig };