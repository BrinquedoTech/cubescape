import { Direction } from "../Enums/Direction";
import { MoveDirection } from "../Enums/MoveDirection";

const MoveDirectionToDirectionConfig: { [key in MoveDirection]: Direction } = {
  [MoveDirection.Down]: Direction.Down,
  [MoveDirection.Up]: Direction.Up,
  [MoveDirection.Left]: Direction.Left,
  [MoveDirection.Right]: Direction.Right,
};

export { MoveDirectionToDirectionConfig };