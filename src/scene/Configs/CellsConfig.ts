import { CellType } from "../Enums/CellType";

const CellConfig = {
  [CellType.Empty]: {
    symbols: [' ', '  '],
  },
  [CellType.Wall]: {
    symbols: ['W'],
  },
  [CellType.Start]: {
    symbols: ['S'],
  },
  [CellType.Finish]: {
    symbols: ['F'],
  },
  [CellType.Spike]: {
    symbols: ['X'],
  },
}

const CellsForFinalMap: CellType[] = [
  CellType.Wall,
  CellType.Finish,
  CellType.Spike,
]

const CellsWithBody: CellType[] = [
  CellType.Wall,
  CellType.Spike,
  CellType.Finish,
]

export { CellConfig, CellsForFinalMap, CellsWithBody };
