import { WallCellType } from "../Enums/WallCellType";

const WallCellsConfig = {
  [WallCellType.Wall]: {
    model: 'wall',
    color: 0xffd700,
  },
  [WallCellType.RoadNoWalls]: {
    model: 'road_no_walls',
    color: 0x00aa00,
  },
}

export { WallCellsConfig };
