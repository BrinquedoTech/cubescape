import { LevelType } from "../../Enums/LevelType";

const ScoreConfig = {
  coin: 10,
  allCoinsBonus: 200,
  bonusForSecond: 10,
  timeForLevel: {
    [LevelType.Level01]: 50,
    [LevelType.Level02]: 100,
    [LevelType.Level03]: 60,
    [LevelType.Level04]: 30,
    [LevelType.Level05]: 30,
  }
}

export { ScoreConfig };