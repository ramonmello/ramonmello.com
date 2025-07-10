import { Component } from "../base/Component";

export interface Vector2 {
  x: number;
  y: number;
}

export class TransformComponent extends Component {
  static readonly TYPE = "transform";

  get type(): string {
    return TransformComponent.TYPE;
  }

  position: Vector2;

  rotation: number;

  scale: Vector2;

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
  }

  setPosition(x: number, y: number): TransformComponent {
    this.position.x = x;
    this.position.y = y;
    return this;
  }

  setRotation(rotation: number): TransformComponent {
    this.rotation = rotation;
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
}
