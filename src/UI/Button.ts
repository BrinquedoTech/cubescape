import * as PIXI from 'pixi.js';
import TWEEN from 'three/addons/libs/tween.module.js';
import mitt, { Emitter } from 'mitt';

type Events = {
  click: string;
};

export default class Button extends PIXI.Container {
  private isPressed: boolean;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor(textureName: string) {
    super();

    this.isPressed = false;

    this._init(textureName);
  }

  _init(textureName: string) {
    this._initView(textureName);
  }

  _initView(textureName: string) {
    const texture = PIXI.Assets.get(textureName);
    const view = new PIXI.Sprite(texture);
    this.addChild(view);

    view.anchor.set(0.5);

    view.eventMode = 'static';
    view.cursor  = 'pointer';

    view.on('pointerdown', () => {
      this.isPressed = true;
      this._onScaleIn();
    });

    view.on('pointerup', () => {
      this.isPressed = false;
      this.emitter.emit('click');
      this._onScaleOut();
    });

    view.on('pointerout', () => {
      if (this.isPressed) {
        this.isPressed = false;
        this._onScaleOut();
      }
    });
  }

  _onScaleIn() {
    new TWEEN.Tween(this.scale)
      .to({ x: 0.97, y: 0.97 }, 100)
      .easing(TWEEN.Easing.Sinusoidal.In)
      .start();
  }

  _onScaleOut() {
    new TWEEN.Tween(this.scale)
      .to({ x: 1, y: 1 }, 100)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start();
  }
}
