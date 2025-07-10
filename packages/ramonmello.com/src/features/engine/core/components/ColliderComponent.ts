import { Component } from "../base/Component";
import { Vector2 } from "./TransformComponent";

export enum ColliderType {
  Circle,
  Rectangle,
  Polygon,
}

export class ColliderComponent extends Component {
  static readonly TYPE = "collider";

  get type(): string {
    return ColliderComponent.TYPE;
  }

  colliderType: ColliderType;

  radius?: number;

  width?: number;

  height?: number;

  vertices?: Float32Array;

  offset: Vector2;

  tags: Set<string>;

  layer: number;

  mask: number;

  active: boolean;

  isTrigger: boolean;

  constructor(type: ColliderType) {
    super();
    this.colliderType = type;
    this.offset = { x: 0, y: 0 };
    this.tags = new Set();
    this.layer = 1;
    this.mask = 0xffffffff;
    this.active = true;
    this.isTrigger = false;
  }

  static createCircle(radius: number): ColliderComponent {
    const collider = new ColliderComponent(ColliderType.Circle);
    collider.radius = radius;
    return collider;
  }

  static createRectangle(width: number, height: number): ColliderComponent {
    const collider = new ColliderComponent(ColliderType.Rectangle);
    collider.width = width;
    collider.height = height;
    return collider;
  }

  static createPolygon(vertices: Float32Array): ColliderComponent {
    const collider = new ColliderComponent(ColliderType.Polygon);
    collider.vertices = vertices;
    return collider;
  }

  setOffset(x: number, y: number): ColliderComponent {
    this.offset.x = x;
    this.offset.y = y;
    return this;
  }

  addTag(tag: string): ColliderComponent {
    this.tags.add(tag);
    return this;
  }

  removeTag(tag: string): ColliderComponent {
    this.tags.delete(tag);
    return this;
  }

  hasTag(tag: string): boolean {
    return this.tags.has(tag);
  }

  setLayer(layer: number): ColliderComponent {
    this.layer = layer;
    return this;
  }

  setMask(mask: number): ColliderComponent {
    this.mask = mask;
    return this;
  }

  setActive(active: boolean): ColliderComponent {
    this.active = active;
    return this;
  }

  setTrigger(isTrigger: boolean): ColliderComponent {
    this.isTrigger = isTrigger;
    return this;
  }

  canCollideWith(other: ColliderComponent): boolean {
    if (!this.active || !other.active) return false;

    if ((this.layer & other.mask) === 0 || (other.layer & this.mask) === 0) {
      return false;
    }

    return true;
  }
}
