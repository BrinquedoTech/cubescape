import * as THREE from 'three';
import { CellType } from "../../Enums/CellType";
import { ICellModelConfig, IGeometryRotationConfig } from '../../Interfaces/ICellConfig';

const RoofModelsConfig: ICellModelConfig = {
  probabilities: [0.9, 0.1, 0.1],
  models: ['roof_01', 'roof_03', 'roof_03'],
}

const RoofCellTypes: CellType[] = [
  CellType.Wall,
]

const RoofCellsGeometryConfig: IGeometryRotationConfig = {
  rotation: new THREE.Euler(Math.PI * 0.5, Math.PI * 0.5, 0),
}


export { RoofModelsConfig, RoofCellTypes, RoofCellsGeometryConfig };
