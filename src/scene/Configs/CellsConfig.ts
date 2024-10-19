import { CellType } from "../Enums/CellType";

const CellConfig = {
  [CellType.Empty]: {
    symbols: [' ', '  '],
  },
  [CellType.Wall]: {
    symbols: ['W', 'WW'],
  },
  [CellType.Start]: {
    symbols: ['S', 'ST'],
  },
  [CellType.Finish]: {
    symbols: ['F', 'FI'],
  },
  [CellType.WallSpike]: {
    symbols: ['X'],
  },
}

const CellsForFinalMap: CellType[] = [
  CellType.Wall,
  CellType.WallSpike,
  CellType.Finish,
]

const CellsWithBody: CellType[] = [
  CellType.Wall,
  CellType.WallSpike,
  CellType.Finish,
]

export { CellConfig, CellsForFinalMap, CellsWithBody };
