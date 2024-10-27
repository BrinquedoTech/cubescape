import * as THREE from 'three';
import { ICellModelConfig, IGeometryRotationConfig } from '../../Interfaces/ICellConfig';

const WallModelsConfig: ICellModelConfig = {
  probabilities: [0.9, 0.04, 0.04, 0.03],
  models: ['wall_01', 'wall_02', 'wall_03', 'wall_04'],
}

const WallCellGeometryConfig: IGeometryRotationConfig = {
  rotation: new THREE.Euler(Math.PI * 0.5, 0, 0),
}

export { WallModelsConfig, WallCellGeometryConfig };
