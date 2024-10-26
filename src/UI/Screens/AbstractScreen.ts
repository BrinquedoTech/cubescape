import * as PIXI from 'pixi.js';
import TWEEN from 'three/addons/libs/tween.module.js';

export default abstract class AbstractScreen extends PIXI.Container {

  constructor() {
    super();
  }

  public abstract onResize(width?: number, height?: number): void;

  public show(instant?: boolean): void {
    this.visible = true;

    if (instant) {
      this.alpha = 1;
      return;
    }

    new TWEEN.Tween(this)
      .to({ alpha: 1 }, 300)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start();
  }

  public hide(instant?: boolean): void {
    if (instant) {
      this.visible = false;
      this.alpha = 0;
      return;
    }

    new TWEEN.Tween(this)
      .to({ alpha: 0 }, 300)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
      .onComplete(() => {
        this.visible = false;
      });
  }
}
