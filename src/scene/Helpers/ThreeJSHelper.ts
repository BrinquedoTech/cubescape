import * as THREE from 'three';
import Loader from '../../core/AssetsLoader';
import { GLTF } from 'three/examples/jsm/Addons.js';

export default class ThreeJSHelper {
  constructor() {

  }

  public static disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        const material = child.material as THREE.Material;
        material.dispose();
      }
    });
  }

  public static killObjects(objects: THREE.Object3D | THREE.Object3D[], parent?: THREE.Object3D): void {
    if (Array.isArray(objects)) {
      objects.forEach((object) => {
        if (parent) {
          parent.remove(object);
        }

        this.disposeObject(object);
      });
    } else {
      if (parent) {
        parent.remove(objects);
      }

      this.disposeObject(objects);
    }
  }

  public static disposeInstancedMesh(instancedMesh: THREE.InstancedMesh): void {
    instancedMesh.geometry.dispose();
    const material = instancedMesh.material as THREE.Material;
    material.dispose();
  }

  public static killInstancedMesh(instancedMesh: THREE.InstancedMesh | THREE.InstancedMesh[], parent?: THREE.Object3D): void {
    if (Array.isArray(instancedMesh)) {
      instancedMesh.forEach((mesh) => {
        if (parent) {
          parent.remove(mesh);
        }

        this.disposeInstancedMesh(mesh);
      });
    } else {
      if (parent) {
        parent.remove(instancedMesh);
      }

      this.disposeInstancedMesh(instancedMesh);
    }
  }

  public static setMaterialToChildren(object: THREE.Object3D, material: THREE.Material): void {
    object.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }

  public static getGeometryFromModel(modelName: string): THREE.BufferGeometry {
    const GLTFModel: GLTF = Loader.assets[modelName] as GLTF;
    const model: THREE.Mesh = GLTFModel.scene.children[0] as THREE.Mesh;
    return model.geometry.clone();
  }

  public static setGeometryRotation(geometry: THREE.BufferGeometry, rotation: THREE.Euler): void {
    const matrix: THREE.Matrix4 = new THREE.Matrix4();
    matrix.makeRotationFromEuler(rotation);
    geometry.applyMatrix4(matrix);
  }

  public static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  public static splitObjectsByProbability(objects: THREE.Object3D[], probabilities: number[]) {
    const shuffledArray: THREE.Object3D[] = objects.sort(() => Math.random() - 0.5);
  
    const totalItems: number = objects.length;
    let currentIndex: number = 0;
    let remainingItems: number = totalItems;
  
    return probabilities.map((probability, index) => {
      const isLast = index === probabilities.length - 1;
      const numberOfItems: number = isLast ? remainingItems : Math.round(probability * totalItems);
      
      const split: THREE.Object3D[] = shuffledArray.slice(currentIndex, currentIndex + numberOfItems);
      currentIndex += numberOfItems;
      remainingItems -= numberOfItems;
  
      return split;
    });
  }

  public static interpolateColors(color1: THREE.Color, color2: THREE.Color, factor: number): THREE.Color {
    const resultColor = new THREE.Color();
    resultColor.lerpColors(color1, color2, factor);

    return resultColor;
  }
}
