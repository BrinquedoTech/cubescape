import * as THREE from 'three';
import { ICellModelConfig, IGeometryRotationConfig } from '../../Interfaces/ICellConfig';

const WallModelsConfig: ICellModelConfig = {
  probabilities: [0.9, 0.025, 0.025, 0.025, 0.025],
  models: ['wall_01', 'wall_02', 'wall_03', 'wall_04', 'wall_05'],
}

const WallCellGeometryConfig: IGeometryRotationConfig = {
  rotation: new THREE.Euler(Math.PI * 0.5, 0, 0),
}

export { WallModelsConfig, WallCellGeometryConfig };
