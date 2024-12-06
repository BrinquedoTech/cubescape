import * as THREE from 'three';
import { ITransform } from '../../Data/Interfaces/IThreeJS';
import { ICubeSideAxisConfig } from '../../Data/Interfaces/ICubeConfig';
import { CubeSideAxisConfig } from '../../Data/Configs/SideConfig';
import { CubeSide } from '../../Data/Enums/Cube/CubeSide';

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

  public static getTransformFromInstance(instanceMesh: THREE.InstancedMesh,instanceId: number): ITransform {
    const matrix = new THREE.Matrix4();
    instanceMesh.getMatrixAt(instanceId, matrix);

    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    matrix.decompose(position, rotation, scale);

    return { position, rotation, scale };
  }

  public static setTransformToInstance(instanceMesh: THREE.InstancedMesh, instanceId: number, transform: ITransform): void {
    const matrix = new THREE.Matrix4();
    matrix.compose(transform.position, transform.rotation, transform.scale);

    instanceMesh.setMatrixAt(instanceId, matrix);
    instanceMesh.instanceMatrix.needsUpdate = true;
  }

  public static setScaleToInstance(instanceMesh: THREE.InstancedMesh, instanceId: number, scale: THREE.Vector3): void {
    const transform = InstancesHelper.getTransformFromInstance(instanceMesh, instanceId);
    transform.scale.copy(scale);

    InstancesHelper.setTransformToInstance(instanceMesh, instanceId, transform);
  }

  public static addLocalPositionToInstanceBySide(instanceMesh: THREE.InstancedMesh, instanceId: number, side: CubeSide, position: THREE.Vector3): void {
    const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[side];

    const xAxis = cubeSideAxisConfig.xAxis;
    const yAxis = cubeSideAxisConfig.yAxis;
    const zAxis = cubeSideAxisConfig.zAxis;

    const transform = InstancesHelper.getTransformFromInstance(instanceMesh, instanceId);
    transform.position[xAxis] += position.x * cubeSideAxisConfig.xFactor;
    transform.position[yAxis] += position.y * cubeSideAxisConfig.yFactor;
    transform.position[zAxis] += position.z * cubeSideAxisConfig.zFactor;

    InstancesHelper.setTransformToInstance(instanceMesh, instanceId, transform);
  }

  public static setLocalPositionToInstanceBySide(instanceMesh: THREE.InstancedMesh, instanceId: number, side: CubeSide, startPosition: THREE.Vector3, position: THREE.Vector3): void {
    const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[side];

    const xAxis = cubeSideAxisConfig.xAxis;
    const yAxis = cubeSideAxisConfig.yAxis;
    const zAxis = cubeSideAxisConfig.zAxis;

    const transform = InstancesHelper.getTransformFromInstance(instanceMesh, instanceId);
    transform.position[xAxis] = startPosition[xAxis] + position.x * cubeSideAxisConfig.xFactor;
    transform.position[yAxis] = startPosition[yAxis] + position.y * cubeSideAxisConfig.yFactor;
    transform.position[zAxis] = startPosition[zAxis] + position.z * cubeSideAxisConfig.zFactor;

    InstancesHelper.setTransformToInstance(instanceMesh, instanceId, transform);
  }
}
