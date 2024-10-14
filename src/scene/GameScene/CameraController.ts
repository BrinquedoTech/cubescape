import * as THREE from 'three';
import PlayerCharacter from './PlayerCharacter/PlayerCharacter';

export class CameraController extends THREE.Group {
  private camera: THREE.PerspectiveCamera;
  private playerCharacter: PlayerCharacter

  constructor(camera: THREE.PerspectiveCamera) {
    super();

    this.camera = camera;
  }

  public update(): void {
    if (this.playerCharacter.isActivated()) {
      const targetPosition = new THREE.Vector3();
      this.playerCharacter.getWorldPosition(targetPosition);
      const currentLookAt = new THREE.Vector3();
      this.camera.getWorldDirection(currentLookAt);
      currentLookAt.add(this.camera.position);

      // const interpolatedLookAt = currentLookAt.lerp(targetPosition, 0.0005);

      // this.camera.lookAt(interpolatedLookAt);
    }
  }

  setPlayerCharacter(playerCharacter: PlayerCharacter) {
    this.playerCharacter = playerCharacter
  }
}
