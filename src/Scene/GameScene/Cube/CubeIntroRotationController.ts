import * as THREE from 'three';
import { CubeIntroConfig } from '../../../Data/Configs/Cube/CubeIntroConfig';
import mitt, { Emitter } from 'mitt';
import TWEEN from 'three/addons/libs/tween.module.js';

type Events = {
  onStop: string;
};

export default class CubeIntroRotationController {
  private object: THREE.Object3D;
  private startObjectRotation: THREE.Euler;
  private isActive: boolean = false;
  private rotationSpeed: THREE.Vector3;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor(object: THREE.Object3D) {
    this.object = object;

    const rotationSpeed = CubeIntroConfig.rotationSpeed;
    this.rotationSpeed = new THREE.Vector3(rotationSpeed.x, rotationSpeed.y, rotationSpeed.z);
  }

  public update(dt: number): void {
    if (this.isActive) {
      this.rotationSpeed.x += (Math.random() - 0.5) * 0.0005;
      this.rotationSpeed.y += (Math.random() - 0.5) * 0.0005;
      this.rotationSpeed.z += (Math.random() - 0.5) * 0.0005;

      this.object.rotation.x += this.rotationSpeed.x * dt;
      this.object.rotation.y += this.rotationSpeed.y * dt;
      this.object.rotation.z += this.rotationSpeed.z * dt;
    }
  }

  public start(): void {
    this.startObjectRotation = this.object.rotation.clone();
    this.isActive = true;
  }

  public getActive(): boolean {
    return this.isActive;
  }

  public stop(): void {
    this.isActive = false;

    const startQuaternion = new THREE.Quaternion().setFromEuler(this.startObjectRotation);
    const currentQuaternion = this.object.quaternion.clone();

    new TWEEN.Tween(currentQuaternion)
      .to({
        x: startQuaternion.x,
        y: startQuaternion.y,
        z: startQuaternion.z,
        w: startQuaternion.w,
      }, CubeIntroConfig.rotateToStartDuration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.object.quaternion.set(
          currentQuaternion.x,
          currentQuaternion.y,
          currentQuaternion.z,
          currentQuaternion.w
        ).normalize();
      })
      .start()
      .onComplete(() => {
        this.emitter.emit('onStop');
      });
  }
}
