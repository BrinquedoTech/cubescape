import * as PIXI from 'pixi.js';
import AudioController from '../scene/GameScene/AudioController';

export default class MuteButton extends PIXI.Container {
  private view: PIXI.Sprite;
  private isMuted: boolean;

  constructor() {
    super();

    this.isMuted = false;

    this.init();
  }

  private init(): void {
    const isMobile: boolean = PIXI.isMobile.any;

    const texture = PIXI.Assets.get('assets/sound-icon');
    texture.source.autoGenerateMipmaps = true;
    const view = this.view = new PIXI.Sprite(texture);
    this.addChild(view);

    view.anchor.set(0.5);
    view.scale.set(isMobile ? 0.4 : 0.5);

    view.eventMode = 'static';
    view.cursor = 'pointer';

    view.on('pointerdown', () => {
      this.toggleMute();
    });
  }

  private toggleMute(): void {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      const texture = PIXI.Assets.get('assets/sound-icon-mute');
      this.view.texture = texture;

      AudioController.getInstance().mute();
    } else {
      const texture = PIXI.Assets.get('assets/sound-icon');
      this.view.texture = texture;

      AudioController.getInstance().unmute();
    }
  }
}
