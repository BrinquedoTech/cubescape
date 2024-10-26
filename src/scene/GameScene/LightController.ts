import * as THREE from 'three';
import PlayerCharacter from './PlayerCharacter/PlayerCharacter';

export class LightController extends THREE.Group {
  private playerCharacter: PlayerCharacter;
  private spotLight: THREE.SpotLight;

  constructor() {
    super();

    this.init();
  }

  public addPlayerCharacter(playerCharacter: PlayerCharacter): void {
    this.playerCharacter = playerCharacter;

    this.spotLight.target = this.playerCharacter;
  }

  private init(): void {
    const spotLight = this.spotLight = new THREE.SpotLight(0xffffff, 100, 20, Math.PI * 0.1, 0.2, 1.9);
    spotLight.position.set(0, 0, 12);
    spotLight.lookAt(0, 5, 0);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 20;
    spotLight.shadow.camera.fov = 30;

    spotLight.shadow.bias = -0.001;

    // this.add(spotLight);

    // helper
    // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // this.add(spotLightHelper);
  }
}
