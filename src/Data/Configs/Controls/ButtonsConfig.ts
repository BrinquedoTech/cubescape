import { ButtonType } from "../../Enums/ButtonType";

const ButtonConfig: { [key in ButtonType]: { keyCode: string[] } } = {
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
  [ButtonType.Start]: {
    keyCode: ['Space', 'Enter'],
  },
}

export { ButtonConfig };