import * as THREE from 'three';
import { ICornerCellsConfig } from '../../Interfaces/ICellConfig';

const CornerCellsConfig: ICornerCellsConfig[] = [
  { model: 'corner_01', position: new THREE.Vector3(-1, 1, 1), rotation: new THREE.Euler(0, -Math.PI * 0.5, 0)},
  { model: 'corner_02', position: new THREE.Vector3(1, 1, 1), rotation: new THREE.Euler(0, 0, 0) },
  { model: 'corner_01', position: new THREE.Vector3(1, 1, -1), rotation: new THREE.Euler(0, Math.PI * 0.5, 0) },
  { model: 'corner_01', position: new THREE.Vector3(-1, 1, -1), rotation: new THREE.Euler(0, Math.PI, 0) },
  { model: 'corner_01', position: new THREE.Vector3(-1, -1, 1), rotation: new THREE.Euler(0, -Math.PI * 0.5, -Math.PI * 0.5) },
  { model: 'corner_01', position: new THREE.Vector3(1, -1, 1), rotation: new THREE.Euler(0, 0, -Math.PI * 0.5) },
  { model: 'corner_01', position: new THREE.Vector3(1, -1, -1), rotation: new THREE.Euler(0, Math.PI * 0.5, -Math.PI * 0.5) },
  { model: 'corner_01', position: new THREE.Vector3(-1, -1, -1), rotation: new THREE.Euler(0, Math.PI, -Math.PI * 0.5) },
];

export default CornerCellsConfig;
