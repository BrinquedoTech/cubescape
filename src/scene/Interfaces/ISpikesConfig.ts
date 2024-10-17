import * as THREE from 'three';
import { Direction } from '../Enums/Direction';

export interface ISpikesGeneralConfig {
  modelStartRotation?: THREE.Euler;
}

export interface ISpikesTypesConfig {
  model: string;
  mainDirection?: ISpikeByTypeDirections[];
  rule: ISpikeTypeRule;
}

export interface ISpikeTypeRule {
  directionsCount: number;
  directions?: Direction[][];
}

export interface ISpikeByTypeDirections {
  type: Direction[];
  modelDirection: Direction;
}
