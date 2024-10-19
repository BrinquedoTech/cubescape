export interface IGameplayConfig {
  grid: {
    size: number;
    scale: number;
  },
  cube: {
    rotation90Speed: number;
    rotation180Speed: number;
  },
  playerCharacter: {
    speed: number;
  },
}