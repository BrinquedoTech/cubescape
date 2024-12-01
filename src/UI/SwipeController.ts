import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import { Direction } from '../Scene2/Enums/Direction';
import { SwipeConfig } from '../Scene2/Configs/SwipeConfig';
import mitt, { Emitter } from 'mitt';

type Events = {
  onSwipe: Direction;
};

export default class SwipeController extends PIXI.Container {
  private overlay: PIXI.Graphics;
  private startPoint: PIXI.Point = new PIXI.Point();
  private previousDirection: Direction;

  public emitter: Emitter<Events> = mitt<Events>();

  constructor() {
    super();

    this.init();
  }

  public onResize(width: number, height: number): void {
    this.overlay.scale.set(width / 10, height / 10);
  }

  private init(): void {
    this.initOverlay();
    this.initEvents();
  }

  private initOverlay(): void {
    const overlay = this.overlay = new Graphics();
    overlay.rect(0, 0, 10, 10);
    overlay.fill({ alpha: 0 });
    this.addChild(overlay);

    overlay.eventMode = 'static';
  }

  private initEvents(): void {
    this.overlay.on('touchstart', (event: PIXI.FederatedPointerEvent) => this.onTouchStart(event));
    this.overlay.on('touchmove', (event: PIXI.FederatedPointerEvent) => this.onTouchMove(event));
  }

  private onTouchStart(event: PIXI.FederatedPointerEvent): void {
    this.startPoint.x = event.clientX;
    this.startPoint.y = event.clientY;

    this.previousDirection = null;
  }

  private onTouchMove(event: PIXI.FederatedPointerEvent): void {
    const currentX: number = event.clientX;
    const currentY: number = event.clientY;

    const distance: number = this.calculateDistance(this.startPoint.x, this.startPoint.y, currentX, currentY);

    if (distance > SwipeConfig.threshold * SwipeConfig.threshold) {
      const angle: number = this.calculateSwipeAngle(this.startPoint.x, this.startPoint.y, currentX, currentY);
      const direction: Direction = this.calculateSwipeDirection(angle);

      if (this.previousDirection !== direction) {
        this.emitter.emit('onSwipe', direction);
        this.previousDirection = direction;
      }

      this.startPoint.x = currentX;
      this.startPoint.y = currentY;
    }
  }

  private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
  }

  private calculateSwipeAngle(x1: number, y1: number, x2: number, y2: number): number {
    const deltaX: number = x2 - x1;
    const deltaY: number = y2 - y1;
    const radians: number = Math.atan2(deltaY, deltaX);
    const angle: number = radians * (180 / Math.PI);
    return angle >= 0 ? angle : angle + 360;
  }

  private calculateSwipeDirection(angle: number): Direction {
    const maxAngle: number = SwipeConfig.maxHalfAngle

    if (angle >= 360 - maxAngle || angle <= maxAngle) {
      return Direction.Right;
    } else if (angle >= 180 - maxAngle && angle <= 180 + maxAngle) {
      return Direction.Left;
    } else if (angle >= 90 - maxAngle && angle <= 90 + maxAngle) {
      return Direction.Down;
    } else if (angle >= 270 - maxAngle && angle <= 270 + maxAngle) {
      return Direction.Up;
    }
  }
}
