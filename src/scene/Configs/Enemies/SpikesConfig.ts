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
    rule: {
      directionsCount: 1,
    }
  },
  [SpikeType.TwoSidesNeighbors]: {
    model: 'spikes_02',
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
    rule: {
      directionsCount: 3,
    }
  },
  [SpikeType.FourSides]: {
    model: 'spikes_05',
    rule: {
      directionsCount: 4,
    }
  },
}

export { SpikesGeneralConfig, SpikesTypeConfig };