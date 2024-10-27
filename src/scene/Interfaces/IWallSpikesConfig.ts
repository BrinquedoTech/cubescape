import * as THREE from 'three';
import { Direction } from '../Enums/Direction';

export interface IWallSpikesGeneralConfig {
  modelStartRotation?: THREE.Euler;
}

export interface IWallSpikesTypesConfig {
  model: string;
  mainDirection?: IWallSpikeByTypeDirections[];
  rule: IWallSpikeTypeRule;
}

export interface IWallSpikeTypeRule {
  directionsCount: number;
  directions?: Direction[][];
}

export interface IWallSpikeByTypeDirections {
  type: Direction[];
  modelDirection: Direction;
}
