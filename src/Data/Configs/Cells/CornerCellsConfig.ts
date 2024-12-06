import * as THREE from 'three';
import { ICornerCellsConfig } from '../../Interfaces/ICellConfig';

const CornerCellsConfig: ICornerCellsConfig[] = [
  { model: 'corner_01', position: new THREE.Vector3(-1, 1, 1), rotation: new THREE.Euler(0, -Math.PI * 0.5, 0)}, // FrontTopLeft
  { model: 'corner_02', position: new THREE.Vector3(1, 1, 1), rotation: new THREE.Euler(0, 0, 0) }, // FrontTopRight
  { model: 'corner_03', position: new THREE.Vector3(-1, -1, 1), rotation: new THREE.Euler(0, -Math.PI * 0.5, -Math.PI * 0.5) }, // FrontDownLeft
  { model: 'corner_01', position: new THREE.Vector3(1, -1, 1), rotation: new THREE.Euler(0, 0, -Math.PI * 0.5) }, // FrontDownRight
  { model: 'corner_04', position: new THREE.Vector3(-1, 1, -1), rotation: new THREE.Euler(0, Math.PI, 0) }, // BackTopLeft
  { model: 'corner_01', position: new THREE.Vector3(1, 1, -1), rotation: new THREE.Euler(0, Math.PI * 0.5, 0) }, // BackTopRight
  { model: 'corner_01', position: new THREE.Vector3(-1, -1, -1), rotation: new THREE.Euler(0, Math.PI, -Math.PI * 0.5) }, // BackDownLeft
  { model: 'corner_05', position: new THREE.Vector3(1, -1, -1), rotation: new THREE.Euler(0, Math.PI * 0.5, -Math.PI * 0.5) }, // BackDownRight
];

export default CornerCellsConfig;
