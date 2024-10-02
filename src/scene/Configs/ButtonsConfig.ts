import { ButtonType } from "../Enums/ButtonType";

const ButtonConfig = {
  [ButtonType.Left]: {
    keyCode: ['ArrowLeft', 'KeyA'],
  },
  [ButtonType.Right]: {
    keyCode: ['ArrowRight', 'KeyD'],
  },
  [ButtonType.Up]: {
    keyCode: ['ArrowUp', 'KeyW'],
  },
  [ButtonType.Down]: {
    keyCode: ['ArrowDown', 'KeyS'],
  },
}

export { ButtonConfig };