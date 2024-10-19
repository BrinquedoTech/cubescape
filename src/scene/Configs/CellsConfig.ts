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
  [CellType.Spike]: {
    symbols: ['X'],
  },
}

const CellsForFinalMap: CellType[] = [
  CellType.Wall,
  CellType.Spike,
  CellType.Finish,
]

const CellsWithBody: CellType[] = [
  CellType.Wall,
  CellType.Spike,
  CellType.Finish,
]

export { CellConfig, CellsForFinalMap, CellsWithBody };
