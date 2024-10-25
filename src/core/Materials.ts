import * as THREE from 'three';
import Loader from './loader';
import { MaterialType } from '../scene/Enums/MaterialType';

export default class Materials {
  static instance: Materials;

  materials: { [key in MaterialType]?: THREE.Material } = {};

  private constructor() {
    this.initMaterials();

  }

  public static getInstance(): Materials {
    if (!Materials.instance) {
      Materials.instance = new Materials();
    }
    return Materials.instance;
  }

  initMaterials(): void {
    this.initMainMaterial();
  }

  initMainMaterial() {
    const texture: THREE.Texture = Loader.assets['dungeon_texture'];
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    this.materials[MaterialType.Main] = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
  }
}

Materials.instance = null;
