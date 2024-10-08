import * as THREE from 'three';
import GameplayConfig from '../Configs/GameplayConfig';

export default class GridHelper {
  constructor() {

  }

  public static isGridCellsEqual(cell1Position: THREE.Vector2, cell2Position: THREE.Vector2): boolean {
    return cell1Position.x === cell2Position.x && cell1Position.y === cell2Position.y;
  }

  public static calculateGridLineDistance(cell1X: number, cell1Y: number, cell2X: number, cell2Y: number): number {
    return Math.abs(cell1X - cell2X) + Math.abs(cell1Y - cell2Y);
  }

  public static calculateGridPositionByCoordinates(x: number, y: number): THREE.Vector2 {
    const gridX: number = Math.round(x / GameplayConfig.gridSize);
    const gridY: number = Math.round(y / GameplayConfig.gridSize);

    return new THREE.Vector2(gridX, gridY);
  }
}