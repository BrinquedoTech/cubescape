import * as THREE from 'three';
import Loader from '../Loader/AssetsLoader';
import { MaterialType } from '../../Data/Enums/MaterialType';

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

  private initMaterials(): void {
    this.initMainMaterial();
    this.initDebugBodyMaterials();
  }

  private initMainMaterial(): void {
    const texture: THREE.Texture = Loader.assets['dungeon_texture'] as THREE.Texture;
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;

    this.materials[MaterialType.Main] = new THREE.MeshPhongMaterial({
      map: texture,
      // side: THREE.DoubleSide,
    });
  }

  private initDebugBodyMaterials(): void {
    this.materials[MaterialType.DebugBodyPlayerCharacter] = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });

    this.materials[MaterialType.DebugBodyConsumables] = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      wireframe: true,
    });

    this.materials[MaterialType.DebugBodyEnemies] = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    });
  }
}

Materials.instance = null;
