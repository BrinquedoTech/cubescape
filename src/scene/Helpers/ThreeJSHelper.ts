import * as THREE from 'three';

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
}