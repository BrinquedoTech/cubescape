import * as THREE from 'three';
import TWEEN from 'three/addons/libs/tween.module.js';
import { IFloorSpikeConfig } from '../../../Interfaces/IEnemyConfig';
import { ILevelConfig } from '../../../Interfaces/ILevelConfig';
import Materials from '../../../../core/Materials';
import { MaterialType } from '../../../Enums/MaterialType';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { CubeSide } from '../../../Enums/CubeSide';
import CubeHelper from '../../../Helpers/CubeHelper';
import InstancesHelper from '../../../Helpers/InstancesHelper';
import { FloorSpikesGeneralConfig } from '../../../Configs/Enemies/FloorSpikesConfig';
import { IFloorSpikeInstanceConfig } from '../../../Interfaces/IFloorSpikesConfig';
import { OBB } from 'three/addons/math/OBB.js';
import DebugConfig from '../../../Configs/Main/DebugConfig';
import { ITransform } from '../../../Interfaces/IThreeJS';
import { ICubeSideAxisConfig } from '../../../Interfaces/ICubeConfig';
import { CubeSideAxisConfig } from '../../../Configs/SideConfig';

export default class FloorSpikes extends THREE.Group {
  private configs: IFloorSpikeConfig[];
  private levelConfig: ILevelConfig;
  private spikeInstanceConfig: IFloorSpikeInstanceConfig[] = [];
  private floorSpikesInstanced: THREE.InstancedMesh;
  private floorSpikesBaseInstanced: THREE.InstancedMesh;
  private bodies: THREE.Mesh[] = [];

  constructor(configs: IFloorSpikeConfig[]) {
    super();

    this.configs = configs;
  }

  public update(dt: number): void {
    this.updateSpikes(dt);
    this.updateBodies();
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;

    this.initSpikeBase();
    this.initSpikes();
  }

  public getBodies(): THREE.Mesh[] {
    return this.bodies;
  }

  public getBodiesForSide(side: CubeSide): THREE.Mesh[] {
    return this.bodies.filter((body) => {
      return body.userData.config.mapConfig.side === side;
    });
  }

  public kill(): void {
    ThreeJSHelper.killInstancedMesh(this.floorSpikesInstanced, this);
    ThreeJSHelper.killInstancedMesh(this.floorSpikesBaseInstanced, this);
    ThreeJSHelper.killObjects(this.bodies, this);

    this.bodies = [];
    this.spikeInstanceConfig = [];
  }

  private initSpikeBase(): void {
    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];
    const geometryBase: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('floor_spikes_base');
    ThreeJSHelper.setGeometryRotation(geometryBase, FloorSpikesGeneralConfig.geometryBaseRotation);

    const floorSpikeBaseObjects: THREE.Object3D[] = [];

    for (let i = 0; i < this.configs.length; i++) {
      const config: IFloorSpikeConfig = this.configs[i];
      const sidePosition: THREE.Vector2 = config.position;
      const side: CubeSide = config.side;

      const floorSpike: THREE.Object3D = new THREE.Object3D();

      const position: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);

      floorSpike.position.copy(position);
      CubeHelper.setSideRotation(floorSpike, side);

      floorSpikeBaseObjects.push(floorSpike);
    }

    const floorSpikesBaseInstanced = this.floorSpikesBaseInstanced = InstancesHelper.createStaticInstancedMesh(floorSpikeBaseObjects, material, geometryBase);
    this.add(floorSpikesBaseInstanced);

    floorSpikesBaseInstanced.receiveShadow = true;
  }

  private initSpikes(): void {
    const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];
    const geometrySpikes: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('floor_spikes');
    ThreeJSHelper.setGeometryRotation(geometrySpikes, FloorSpikesGeneralConfig.geometrySpikeRotation);

    const floorSpikeObjects: THREE.Object3D[] = [];

    for (let i = 0; i < this.configs.length; i++) {
      const config: IFloorSpikeConfig = this.configs[i];
      const sidePosition: THREE.Vector2 = config.position;
      const side: CubeSide = config.side;

      const floorSpike: THREE.Object3D = new THREE.Object3D();

      const position: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);

      const cubeSideAxisConfig: ICubeSideAxisConfig = CubeSideAxisConfig[side];
  
      position[cubeSideAxisConfig.xAxis] += FloorSpikesGeneralConfig.spikesStartPosition.x * cubeSideAxisConfig.xFactor;
      position[cubeSideAxisConfig.yAxis] += FloorSpikesGeneralConfig.spikesStartPosition.y * cubeSideAxisConfig.yFactor;
      position[cubeSideAxisConfig.zAxis] += FloorSpikesGeneralConfig.spikesStartPosition.z * cubeSideAxisConfig.zFactor;

      floorSpike.position.copy(position);
      CubeHelper.setSideRotation(floorSpike, side);

      floorSpikeObjects.push(floorSpike);
      this.spikeInstanceConfig.push({ mapConfig: config, instanceId: i, isActive: false, startPosition: position, time: 0 });
    }

    const floorSpikesInstanced = this.floorSpikesInstanced = InstancesHelper.createStaticInstancedMesh(floorSpikeObjects, material, geometrySpikes);
    this.add(floorSpikesInstanced);

    floorSpikesInstanced.instanceMatrix.usage = THREE.DynamicDrawUsage;
    floorSpikesInstanced.receiveShadow = true;
    floorSpikesInstanced.castShadow = true;

    this.initBodies(floorSpikeObjects);
  }

  private initBodies(coinsObjects: THREE.Object3D[]): void {
    const material: THREE.Material = Materials.getInstance().materials[MaterialType.DebugBody];
    const viewGeometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('floor_spikes');
    const view = new THREE.Mesh(viewGeometry, material);
    const boundingBox: THREE.Box3 = new THREE.Box3().setFromObject(view);
    const size: THREE.Vector3 = boundingBox.getSize(new THREE.Vector3());

    for (let i = 0; i < coinsObjects.length; i++) {
      const coinObject = coinsObjects[i];

      const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
  
      const body = new THREE.Mesh(geometry, material);
      this.add(body);
  
      body.geometry.computeBoundingBox();
      body.geometry.userData.obb = new OBB().fromBox3(body.geometry.boundingBox);
      body.userData.obb = new OBB();
  
      body.userData.config = this.spikeInstanceConfig[i];
      body.visible = false;

      body.position.copy(coinObject.position);
  
      if (DebugConfig.gameplay.physicalBody) {
        body.visible = true;
      }
      
      this.bodies.push(body);
    }
  }

  private updateSpikes(dt: number): void {
    for (let i = 0; i < this.spikeInstanceConfig.length; i++) {
      const instanceConfig: IFloorSpikeInstanceConfig = this.spikeInstanceConfig[i];

      if (instanceConfig.isActive) {
        instanceConfig.time += dt;

        if (instanceConfig.time > instanceConfig.mapConfig.activeTime) {
          instanceConfig.time = 0;
          this.deactivateSpikes(instanceConfig.mapConfig.id);
        }
      } else {  
        instanceConfig.time += dt;

        if (instanceConfig.time > instanceConfig.mapConfig.inactiveTime) {
          instanceConfig.time = 0;
          this.activateSpikes(instanceConfig.mapConfig.id);
        }
      }
    }
  }

  private updateBodies(): void {
    for (let i = 0; i < this.bodies.length; i++) {
      const body = this.bodies[i];

      const instanceId: number = body.userData.config.instanceId;

      const transform: ITransform = InstancesHelper.getTransformFromInstance(this.floorSpikesInstanced, instanceId);
      body.position.copy(transform.position);
      body.quaternion.copy(transform.rotation);

      body.userData.obb.copy(body.geometry.userData.obb);
      body.userData.obb.applyMatrix4(body.matrixWorld);
    }
  }

  private activateSpikes(id: number): void {
    const instanceConfig: IFloorSpikeInstanceConfig = this.getConfigById(id);

    if (instanceConfig.isActive) {
      return;
    }

    instanceConfig.isActive = true;
    const side: CubeSide = instanceConfig.mapConfig.side;
    const instanceId: number = instanceConfig.instanceId;

    const position = { z: 0 };

    new TWEEN.Tween(position)
      .to({ z: 0.5 }, 150)
      .easing(TWEEN.Easing.Quartic.In)
      .onUpdate(() => {
        const targetPosition = new THREE.Vector3(0, 0, position.z);
        InstancesHelper.setLocalPositionToInstanceBySide(this.floorSpikesInstanced, instanceId, side, instanceConfig.startPosition, targetPosition);
      })
      .start();
  }

  private deactivateSpikes(id: number): void {
    const instanceConfig: IFloorSpikeInstanceConfig = this.getConfigById(id);

    if (!instanceConfig.isActive) {
      return;
    }

    instanceConfig.isActive = false;
    const side: CubeSide = instanceConfig.mapConfig.side;
    const instanceId: number = instanceConfig.instanceId;
    const position = { z: 0.5 };

    new TWEEN.Tween(position)
      .to({ z: 0 }, 250)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .onUpdate(() => {
        const targetPosition = new THREE.Vector3(0, 0, position.z);
        InstancesHelper.setLocalPositionToInstanceBySide(this.floorSpikesInstanced, instanceId, side, instanceConfig.startPosition, targetPosition);
      })
      .start();
  }

  private getConfigById(id: number) {
    return this.spikeInstanceConfig.filter((config) => config.mapConfig.id === id)[0];
  }
}
