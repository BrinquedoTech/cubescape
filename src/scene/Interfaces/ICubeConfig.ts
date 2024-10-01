import { CubeEdge } from "../Enums/CubeEdge";
import { CubeSide } from "../Enums/CubeSide";

export interface IEdgeAxisConfig {
  edge: CubeEdge;
  axis: string;
}

export interface ICubeSurfaceAxisConfig {
  side: CubeSide;
  configIndex: number;
  xAxis: string;
  yAxis: string;
  zAxis: string;
  xFactor: number;
  yFactor: number;
}
