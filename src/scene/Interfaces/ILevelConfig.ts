export interface ILevelConfig {
  size: number;
  map: {
    surfaces: ILevelMapConfig;
    edges: ILevelEdgeConfig;
  },
}

export interface ILevelMapConfig {
  [key: string]: number[][];
}

export interface ILevelEdgeConfig {
  [key: string]: number[];
}