export default class ArrayHelper {
  constructor() {

  }

  public static create2DArray(rows: number, columns: number, fillValue: string): string[][] {
    const array: string[][] = new Array(rows);

    for (let i = 0; i < rows; i++) {
      array[i] = new Array(columns).fill(fillValue);
    }

    return array;
  }

  public static fillCornerValues(array: string[][], value: string): void {
    const corners = (mapSizeX: number, mapSizeY: number) => 
      [
        [0, 0],
        [0, mapSizeX - 1],
        [mapSizeY - 1, 0],
        [mapSizeY - 1, mapSizeX - 1]
      ];
    
    corners(array[0].length, array.length).forEach(([y, x]) => array[y][x] = value);
  }

  public static isArraysHasSameValues(array1: any[], array2: any[]): boolean {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array2.indexOf(array1[i]) === -1) {
        return false;
      }
    }

    return true;
  }

  public static getRandomArrayElement(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }
}