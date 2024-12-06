import * as THREE from 'three';
import { IWallSpikesGeneralConfig } from '../../Interfaces/Enemies/IWallSpikesConfig';

const WallSpikesGeneralConfig: IWallSpikesGeneralConfig = {
  modelStartRotation: new THREE.Euler(Math.PI * 0.5, 0, 0),
}

export { WallSpikesGeneralConfig };