import * as THREE from 'three';
import CubeHelper from '../../Helpers/CubeHelper';
import { ILevelConfig } from '../../Interfaces/ILevelConfig';
import { ICubePosition } from '../../Interfaces/ICubeConfig';
import { CellType } from '../../Enums/CellType';
import Materials from '../../../core/Materials';
import { MaterialType } from '../../Enums/MaterialType';
import ThreeJSHelper from '../../Helpers/ThreeJSHelper';
import { CubeSide } from '../../Enums/CubeSide';
import InstancesHelper from '../../Helpers/InstancesHelper';
import { ITransform } from '../../Interfaces/IThreeJS';
import { CoinsConfig } from '../../Configs/CoinsConfig';

export default class Coins extends THREE.Group {
  private levelConfig: ILevelConfig;
  private coinsInstanced: THREE.InstancedMesh;
  private coinsConfig = [];
  private elapsedTime: number = 0;

  constructor() {
    super();

  }

  public update(dt: number): void {
    this.elapsedTime += dt;

    this.updateRotation(dt);
    this.updatePosition();
  }

  public init(levelConfig: ILevelConfig): void {
    this.levelConfig = levelConfig;
    const itemPositions: ICubePosition[] = CubeHelper.getItemPositions(levelConfig.map.sides, CellType.Coin);

    if (itemPositions.length > 0) {
      const itemsCount: number = itemPositions.length;
      const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];
      const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(CoinsConfig.model);
      ThreeJSHelper.setGeometryRotation(geometry, CoinsConfig.geometryRotation);

      const coinsObjects: THREE.Object3D[] = [];

      for (let i = 0; i < itemPositions.length; i++) {
        const cubePosition: ICubePosition = itemPositions[i];
        const sidePosition: THREE.Vector2 = cubePosition.gridPosition;
        const side: CubeSide = cubePosition.side;
  
        const coin: THREE.Object3D = new THREE.Object3D();
  
        const position: THREE.Vector3 = CubeHelper.getPositionByGridAndSide(this.levelConfig.size, side, sidePosition.x, sidePosition.y);
  
        coin.position.copy(position);
        CubeHelper.setSideRotation(coin, side);
  
        coinsObjects.push(coin);
      }

      const coinsInstanced = this.coinsInstanced = new THREE.InstancedMesh(geometry, material, itemsCount);
      this.add(coinsInstanced);

      for (let i = 0; i < itemsCount; i++) {
        const cubePosition: ICubePosition = itemPositions[i];
        const object = coinsObjects[i];
        object.updateMatrix();
        coinsInstanced.setMatrixAt(i, object.matrix);

        const idlePositionSign = Math.random() > 0.5 ? 1 : -1;
        const idlePositionStartTime = Math.random() * Math.PI * 2;

        this.coinsConfig.push({
          mapConfig: cubePosition,
          instanceId: i,
          isActive: false,
          startPosition: object.position.clone(),
          idlePositionSign: idlePositionSign,
          idlePositionStartTime: idlePositionStartTime,
        });
      }

      coinsInstanced.instanceMatrix.needsUpdate = true;

      coinsInstanced.receiveShadow = true;
      coinsInstanced.castShadow = true;

      this.setStartRandomRotation();
    }
  }

  public removeCoins(): void {
    ThreeJSHelper.disposeInstancedMesh(this.coinsInstanced);
  }

  public showCoin(cubeSide: CubeSide, gridPosition: THREE.Vector2): void {
    const config = this.getConfigByPosition(cubeSide, gridPosition);
    
    if (config) {
      const scale = new THREE.Vector3(1, 1, 1);
      InstancesHelper.setScaleToInstance(this.coinsInstanced, config.instanceId, scale);
    }
  }

  public hideCoin(cubeSide: CubeSide, gridPosition: THREE.Vector2): void {
    const config = this.getConfigByPosition(cubeSide, gridPosition);

    if (config) {
      const hideScale = CoinsConfig.hideScale;
      const scale = new THREE.Vector3(hideScale, hideScale, hideScale);
      InstancesHelper.setScaleToInstance(this.coinsInstanced, config.instanceId, scale);
    }
  }

  private updateRotation(dt: number): void {
    for (let i = 0; i < this.coinsConfig.length; i++) {
      const config = this.coinsConfig[i];
      const instanceId: number = config.instanceId;

      const transform: ITransform = InstancesHelper.getTransformFromInstance(this.coinsInstanced, instanceId);
      const rotation = new THREE.Euler().setFromQuaternion(transform.rotation);
      rotation.z += dt * CoinsConfig.idle.rotationSpeed;
      transform.rotation.setFromEuler(rotation);
      InstancesHelper.setTransformToInstance(this.coinsInstanced, instanceId, transform);
    }
  }

  private updatePosition(): void {
    for (let i = 0; i < this.coinsConfig.length; i++) {
      const config = this.coinsConfig[i];
      const instanceId: number = config.instanceId;
      const side: CubeSide = config.mapConfig.side;

      const targetPosition = new THREE.Vector3();
      targetPosition.z = Math.sin(this.elapsedTime * CoinsConfig.idle.positionFrequency + config.idlePositionStartTime) * CoinsConfig.idle.positionAmplitude * config.idlePositionSign;

      InstancesHelper.setLocalPositionToInstanceBySide(this.coinsInstanced, instanceId, side, config.startPosition, targetPosition);
    }
  }

  private setStartRandomRotation(): void {
    for (let i = 0; i < this.coinsConfig.length; i++) {
      const config = this.coinsConfig[i];
      const instanceId: number = config.instanceId;

      const transform: ITransform = InstancesHelper.getTransformFromInstance(this.coinsInstanced, instanceId);
      const rotation = new THREE.Euler().setFromQuaternion(transform.rotation);
      rotation.z = Math.random() * Math.PI * 2;
      transform.rotation.setFromEuler(rotation);
      InstancesHelper.setTransformToInstance(this.coinsInstanced, instanceId, transform);
    }
  }

  private getConfigByPosition(cubeSide: CubeSide, gridPosition: THREE.Vector2) {
    return this.coinsConfig.find((config) => {
      return config.mapConfig.side === cubeSide && config.mapConfig.gridPosition.x === gridPosition.x && config.mapConfig.gridPosition.y === gridPosition.y;
    });
  }
}
