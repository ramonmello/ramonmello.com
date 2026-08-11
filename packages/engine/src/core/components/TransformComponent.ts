import { Component } from "../base/Component";

export interface Vector2 {
  x: number;
  y: number;
}

const TAU = Math.PI * 2;

export class TransformComponent extends Component {
  static readonly TYPE = "transform";

  get type(): string {
    return TransformComponent.TYPE;
  }

  position: Vector2;

  rotation: number;

  scale: Vector2;

  /**
   * Position this entity held when the current simulation step began. The
   * renderer blends it with {@link position} to draw the frames that fall
   * between two steps.
   */
  previousPosition: Vector2;

  /** Rotation this entity held when the current simulation step began. */
  previousRotation: number;

  constructor(
    x: number = 0,
    y: number = 0,
    rotation: number = 0,
    scaleX: number = 1,
    scaleY: number = 1
  ) {
    super();
    this.position = { x, y };
    this.rotation = rotation;
    this.scale = { x: scaleX, y: scaleY };
    this.previousPosition = { x, y };
    this.previousRotation = rotation;
  }

  /** Makes the pose the step starts at the origin the renderer blends from. */
  beginStep(): void {
    this.previousPosition.x = this.position.x;
    this.previousPosition.y = this.position.y;
    this.previousRotation = this.rotation;
  }

  setPosition(x: number, y: number): TransformComponent {
    this.position.x = x;
    this.position.y = y;
    // A teleport has no in-between: interpolating one would draw the entity
    // sliding across the very gap it skipped.
    this.previousPosition.x = x;
    this.previousPosition.y = y;
    return this;
  }

  setRotation(rotation: number): TransformComponent {
    this.rotation = rotation;
    this.previousRotation = rotation;
    return this;
  }

  setScale(x: number, y: number): TransformComponent {
    this.scale.x = x;
    this.scale.y = y;
    return this;
  }

  translate(deltaX: number, deltaY: number): TransformComponent {
    this.position.x += deltaX;
    this.position.y += deltaY;
    return this;
  }

  rotate(deltaRotation: number): TransformComponent {
    this.rotation += deltaRotation;
    return this;
  }

  /** Horizontal position to draw at, `alpha` of the way through the step. */
  interpolatedX(alpha: number): number {
    return (
      this.previousPosition.x +
      (this.position.x - this.previousPosition.x) * alpha
    );
  }

  /** Vertical position to draw at, `alpha` of the way through the step. */
  interpolatedY(alpha: number): number {
    return (
      this.previousPosition.y +
      (this.position.y - this.previousPosition.y) * alpha
    );
  }

  /**
   * Rotation to draw at, taking the shorter of the two arcs so a body crossing
   * the 0/2π seam does not spin the long way round for one frame.
   */
  interpolatedRotation(alpha: number): number {
    const delta = this.rotation - this.previousRotation;
    const shortest = (((delta + Math.PI) % TAU) + TAU) % TAU - Math.PI;
    return this.previousRotation + shortest * alpha;
  }
}
