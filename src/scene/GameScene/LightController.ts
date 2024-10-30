import * as THREE from 'three';
import PlayerCharacter from './PlayerCharacter/PlayerCharacter';
import TWEEN from 'three/addons/libs/tween.module.js';
import { LightConfig } from '../Configs/Main/LightConfig';
import ThreeJSHelper from '../Helpers/ThreeJSHelper';

export class LightController extends THREE.Group {
  private playerCharacter: PlayerCharacter;
  private spotLight: THREE.SpotLight;
  private scene: THREE.Scene;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene, ambientLight: THREE.AmbientLight, directionalLight: THREE.DirectionalLight) {
    super();

    this.scene = scene;
    this.ambientLight = ambientLight;
    this.directionalLight = directionalLight;

    this.init();
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
    // this.initSpotLight();
    
  }

  // private initSpotLight(): void {
  //   const spotLight = this.spotLight = new THREE.SpotLight(0xffffff, 100, 20, Math.PI * 0.1, 0.2, 1.9);
  //   spotLight.position.set(0, 0, 12);
  //   spotLight.lookAt(0, 5, 0);

  //   spotLight.castShadow = true;

  //   spotLight.shadow.mapSize.width = 1024;
  //   spotLight.shadow.mapSize.height = 1024;

  //   spotLight.shadow.camera.near = 1;
  //   spotLight.shadow.camera.far = 20;
  //   spotLight.shadow.camera.fov = 30;

  //   spotLight.shadow.bias = -0.001;

  //   // this.add(spotLight);

  //   // helper
  //   // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  //   // this.add(spotLightHelper);
  // }
}
