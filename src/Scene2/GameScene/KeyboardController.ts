import mitt, { Emitter } from "mitt";
import { ButtonConfig } from "../Configs/ButtonsConfig";
import { ButtonType } from "../Enums/ButtonType";

type Events = {
  onButtonPress: string;
};

export class KeyboardController {
  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {

    this.init();
  }

  private init(): void {
    window.addEventListener("keydown", (event) => this.onPressDownSignal(event));
  }

  private onPressDownSignal(event: KeyboardEvent): void {
    for (const value in ButtonType) {
      const buttonType = ButtonType[value];
      const config = ButtonConfig[buttonType];

      if (config.keyCode && config.keyCode.includes(event.code)) {
        this.emitter.emit('onButtonPress', buttonType);
      }
    }
  }
}
