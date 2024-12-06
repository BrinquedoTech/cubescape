import * as THREE from 'three';
import PlayerCharacter from './PlayerCharacter/PlayerCharacter';
import TWEEN from 'three/addons/libs/tween.module.js';
import { LightConfig } from '../../Data/Configs/Main/LightConfig';
import ThreeJSHelper from '../Helpers/ThreeJSHelper';
import { ILevelConfig } from '../../Data/Interfaces/ILevelConfig';

export class LightController extends THREE.Group {
  private playerCharacter: PlayerCharacter;
  private spotLight: THREE.SpotLight;
  private scene: THREE.Scene;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private shadowCameraHelper: THREE.CameraHelper;

  constructor(scene: THREE.Scene, ambientLight: THREE.AmbientLight, directionalLight: THREE.DirectionalLight) {
    super();

    this.scene = scene;
    this.ambientLight = ambientLight;
    this.directionalLight = directionalLight;

    this.init();
  }

  public setLightForLevel(levelConfig: ILevelConfig): void {
    const levelSize: THREE.Vector3 = levelConfig.size;
    const longestSide: number = Math.max(levelSize.x, levelSize.y, levelSize.z) + 2;
    const lightConfig = LightConfig.directionalLight;

    const positionX: number = longestSide * Math.sin(THREE.MathUtils.degToRad(lightConfig.position.angleX));
    const positionY: number = longestSide * Math.sin(THREE.MathUtils.degToRad(lightConfig.position.angleY));
    this.directionalLight.position.set(positionX, positionY, longestSide + lightConfig.position.bonusDistanceZ);

    const shadowDistance: number = longestSide * 0.5 * lightConfig.shadows.camera.sizeCoefficient;

    this.directionalLight.shadow.camera.left = -shadowDistance;
    this.directionalLight.shadow.camera.right = shadowDistance;
    this.directionalLight.shadow.camera.top = shadowDistance;
    this.directionalLight.shadow.camera.bottom = -shadowDistance;

    const distanceToCenter: number = new THREE.Vector3().copy(this.directionalLight.position).sub(new THREE.Vector3(0, 0, 0)).length();

    this.directionalLight.shadow.camera.far = distanceToCenter + longestSide;

    this.directionalLight.shadow.camera.updateProjectionMatrix();

    if (lightConfig.shadows.helper) {
      this.shadowCameraHelper.update();
    }
  }

  public setDarkScene(): void {
    new TWEEN.Tween(this.ambientLight)
      .to({ intensity: 0 }, LightConfig.darkMode.duration)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
      .onComplete(() => {
        this.ambientLight.visible = false;
      });

    new TWEEN.Tween(this.directionalLight)
      .to({ intensity: 0 }, LightConfig.darkMode.duration)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
      .onComplete(() => {
        this.directionalLight.visible = false;
      });

    const colorObject = { value: 0 };
    const startColor = new THREE.Color(LightConfig.lightMode.backgroundColor);
    const endColor = new THREE.Color(LightConfig.darkMode.backgroundColor);

    new TWEEN.Tween(colorObject)
      .to({ value: 1 }, LightConfig.darkMode.duration)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
      .onUpdate(() => {
        this.scene.background = ThreeJSHelper.interpolateColors(startColor, endColor, colorObject.value);
      });
  }

  public setLightScene(): void {
    this.ambientLight.visible = true;
    this.directionalLight.visible = true;

    new TWEEN.Tween(this.ambientLight)
      .to({ intensity: LightConfig.ambientLight.intensity }, LightConfig.lightMode.duration)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start();

    new TWEEN.Tween(this.directionalLight)
      .to({ intensity: LightConfig.directionalLight.intensity }, LightConfig.lightMode.duration)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start();

    const colorObject = { value: 0 };
    const startColor = new THREE.Color(LightConfig.darkMode.backgroundColor);
    const endColor = new THREE.Color(LightConfig.lightMode.backgroundColor);

    new TWEEN.Tween(colorObject)
      .to({ value: 1 }, LightConfig.lightMode.duration)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
      .onUpdate(() => {
        this.scene.background = ThreeJSHelper.interpolateColors(startColor, endColor, colorObject.value);
      });
  }

  public addPlayerCharacter(playerCharacter: PlayerCharacter): void {
    this.playerCharacter = playerCharacter;

    this.spotLight.target = this.playerCharacter;
  }

  private init(): void {
    this.configureShadow();
  }

  private configureShadow(): void {
    const shadowConfig = LightConfig.directionalLight.shadows;
    this.directionalLight.castShadow = shadowConfig.enabled;

    this.directionalLight.shadow.mapSize.width = shadowConfig.mapSize.width;
    this.directionalLight.shadow.mapSize.height = shadowConfig.mapSize.height;

    this.directionalLight.shadow.camera.near = shadowConfig.camera.near;

    this.directionalLight.shadow.bias = shadowConfig.camera.bias;

    if (shadowConfig.helper) {
      const shadowCameraHelper = this.shadowCameraHelper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
      this.scene.add(shadowCameraHelper);
    }
  }
}
