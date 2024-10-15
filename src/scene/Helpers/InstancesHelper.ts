import * as THREE from 'three';

export default class InstancesHelper {
  constructor() {

  }

  public static createStaticInstancedMesh(objects: THREE.Object3D[], material: THREE.Material, geometry: THREE.BufferGeometry): THREE.InstancedMesh {
    const instanceCount: number = objects.length;

    const instancedMesh = new THREE.InstancedMesh(geometry, material, instanceCount);

    for (let i = 0; i < instanceCount; i++) {
      const object = objects[i];
      object.updateMatrix();
      instancedMesh.setMatrixAt(i, object.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;

    return instancedMesh;
  }
}
