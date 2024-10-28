import * as THREE from 'three';
import { CellType } from "../../Enums/CellType";
import { ICellModelConfig, IGeometryRotationConfig } from '../../Interfaces/ICellConfig';

const RoofModelsConfig: ICellModelConfig = {
  probabilities: [0.88, 0.03, 0.02, 0.02, 0.02, 0.03],
  models: ['roof_01', 'roof_02', 'roof_03', 'roof_04', 'roof_05', 'roof_06'],
}

const RoofCellTypes: CellType[] = [
  CellType.Wall,
]

const RoofCellsGeometryConfig: IGeometryRotationConfig = {
  rotation: new THREE.Euler(Math.PI * 0.5, Math.PI * 0.5, 0),
}

export { RoofModelsConfig, RoofCellTypes, RoofCellsGeometryConfig };
