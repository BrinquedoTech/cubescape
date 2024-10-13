import { CellType } from "../Enums/CellType";

export default class ArrayHelper {
  constructor() {

  }

  public static create2DArray(rows: number, columns: number, fillValue: CellType): CellType[][] {
    const array: CellType[][] = new Array(rows);

    for (let i = 0; i < rows; i++) {
      array[i] = new Array(columns).fill(fillValue);
    }

    return array;
  }

  public static fillCornerValues(array: CellType[][], value: CellType): void {
    const corners = (mapSizeX: number, mapSizeY: number) => 
      [
        [0, 0],
        [0, mapSizeX - 1],
        [mapSizeY - 1, 0],
        [mapSizeY - 1, mapSizeX - 1]
      ];
    
    corners(array[0].length, array.length).forEach(([y, x]) => array[y][x] = value);
  }
}