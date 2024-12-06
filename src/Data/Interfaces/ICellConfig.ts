import * as THREE from 'three';
import { CellType } from '../../Data/Enums/Cube/CellType';

export interface ICellTypeWithID {
  cellType: CellType;
  id: number;
}

export interface IGeometryRotationConfig {
  rotation: THREE.Euler
}

export interface ICellModelConfig {
  probabilities: number[];
  models: string[];
}

export interface ICornerCellsConfig {
  model: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
}

