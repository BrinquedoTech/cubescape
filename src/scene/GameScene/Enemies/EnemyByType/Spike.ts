import * as THREE from 'three';
import { ISpikeConfig } from '../../../Interfaces/IEnemyConfig';

export default class Spike extends THREE.Group {
  private config: ISpikeConfig;

  constructor(config: ISpikeConfig) {
    super();

    this.config = config;

    this.init();
  }

  private init(): void {
    console.log(this.config);
  }
}
