import { WallCellType } from "../Enums/WallCellType";

const WallCellsConfig = {
  [WallCellType.Wall]: {
    model: 'wall',
  },
  [WallCellType.RoadNoWalls]: {
    model: 'road_no_walls',
  },
}

export { WallCellsConfig };
