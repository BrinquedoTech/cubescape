import { CellModelType } from "../Enums/CellModelType";

const CellModelConfig = {
  [CellModelType.Roof]: {
    model: 'roof',
    color: 0xffd700,
  },
  [CellModelType.Road]: {
    model: 'floor',
    color: 0x00aa00,
  },
}

export { CellModelConfig };
