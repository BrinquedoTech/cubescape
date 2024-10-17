import * as THREE from 'three';
import { SpikeType } from '../../Enums/SpikeType';
import { Direction } from '../../Enums/Direction';
import { ISpikesGeneralConfig, ISpikesTypesConfig as ISpikeTypeConfig } from '../../Interfaces/ISpikesConfig';

const SpikesGeneralConfig: ISpikesGeneralConfig = {
  modelStartRotation: new THREE.Euler(Math.PI * 0.5, Math.PI * 0.5, 0),
}

const SpikesTypeConfig: { [key in SpikeType]: ISpikeTypeConfig } = {
  [SpikeType.OneSide]: {
    model: 'spikes_01',
    mainDirection: [
      { type: [Direction.Up], modelDirection: Direction.Up },
      { type: [Direction.Right], modelDirection: Direction.Right },
      { type: [Direction.Down], modelDirection: Direction.Down },
      { type: [Direction.Left], modelDirection: Direction.Left },
    ],
    rule: {
      directionsCount: 1,
    }
  },
  [SpikeType.TwoSidesNeighbors]: {
    model: 'spikes_02',
    mainDirection: [
      { type: [Direction.Up, Direction.Right], modelDirection: Direction.Up },
      { type: [Direction.Right, Direction.Down], modelDirection: Direction.Right },
      { type: [Direction.Down, Direction.Left], modelDirection: Direction.Down },
      { type: [Direction.Left, Direction.Up], modelDirection: Direction.Left },
    ],
    rule: {
      directionsCount: 2,
      directions: [
        [Direction.Up, Direction.Right],
        [Direction.Right, Direction.Down],
        [Direction.Down, Direction.Left],
        [Direction.Left, Direction.Up],
      ]
    }
  },
  [SpikeType.TwoSidesOpposites]: {
    model: 'spikes_03',
    mainDirection: [
      { type: [Direction.Up, Direction.Down], modelDirection: Direction.Up },
      { type: [Direction.Left, Direction.Right], modelDirection: Direction.Left },
    ],
    rule: {
      directionsCount: 2,
      directions: [
        [Direction.Up, Direction.Down],
        [Direction.Left, Direction.Right],
      ]
    }
  },
  [SpikeType.ThreeSides]: {
    model: 'spikes_04',
    mainDirection: [
      { type: [Direction.Up, Direction.Right, Direction.Down], modelDirection: Direction.Right },
      { type: [Direction.Right, Direction.Down, Direction.Left], modelDirection: Direction.Down },
      { type: [Direction.Down, Direction.Left, Direction.Up], modelDirection: Direction.Left },
      { type: [Direction.Left, Direction.Up, Direction.Right], modelDirection: Direction.Up },
    ],
    rule: {
      directionsCount: 3,
    }
  },
  [SpikeType.FourSides]: {
    model: 'spikes_05',
    mainDirection: [
      { type: [Direction.Up, Direction.Right, Direction.Down, Direction.Left], modelDirection: Direction.Up },
    ],
    rule: {
      directionsCount: 4,
    }
  },
}

export { SpikesGeneralConfig, SpikesTypeConfig };