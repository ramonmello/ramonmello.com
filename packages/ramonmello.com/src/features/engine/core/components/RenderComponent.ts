import { Component } from "../base/Component";

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class RenderComponent extends Component {
  static readonly TYPE = "render";

  get type(): string {
    return RenderComponent.TYPE;
  }

  vertices: Float32Array;

  color: Color;

  visible: boolean = true;

  zIndex: number = 0;

  drawMode: "triangles" | "lines" | "line_loop" | "points" = "triangles";

  constructor(
    vertices: Float32Array,
    color: Partial<Color> = { r: 1, g: 1, b: 1, a: 1 }
  ) {
    super();
    this.vertices = vertices;
    this.color = {
      r: color.r ?? 1,
      g: color.g ?? 1,
      b: color.b ?? 1,
      a: color.a ?? 1,
    };
  }

  setColor(r: number, g: number, b: number, a: number = 1): RenderComponent {
    this.color = { r, g, b, a };
    return this;
  }

  setVisible(visible: boolean): RenderComponent {
    this.visible = visible;
    return this;
  }

  setZIndex(zIndex: number): RenderComponent {
    this.zIndex = zIndex;
    return this;
  }

  setDrawMode(
    mode: "triangles" | "lines" | "line_loop" | "points"
  ): RenderComponent {
    this.drawMode = mode;
    return this;
  }

  setVertices(vertices: Float32Array): RenderComponent {
    this.vertices = vertices;
    return this;
  }

  static createRectangle(width: number, height: number): RenderComponent {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const vertices = new Float32Array([
      -halfWidth,
      -halfHeight,
      halfWidth,
      -halfHeight,
      halfWidth,
      halfHeight,

      halfWidth,
      halfHeight,
      -halfWidth,
      halfHeight,
      -halfWidth,
      -halfHeight,
    ]);

    return new RenderComponent(vertices);
  }

  static createTriangle(size: number): RenderComponent {
    const halfSize = size / 2;
    const height = (Math.sqrt(3) / 2) * size;

    const vertices = new Float32Array([
      0,
      height / 2,
      -halfSize,
      -height / 2,
      halfSize,
      -height / 2,
    ]);

    return new RenderComponent(vertices);
  }

  static createCircle(radius: number, segments: number = 20): RenderComponent {
    const vertices = new Float32Array(segments * 3 * 2);

    for (let i = 0; i < segments; i++) {
      const angle1 = (i / segments) * Math.PI * 2;
      const angle2 = ((i + 1) / segments) * Math.PI * 2;

      vertices[i * 6] = 0;
      vertices[i * 6 + 1] = 0;

      vertices[i * 6 + 2] = Math.cos(angle1) * radius;
      vertices[i * 6 + 3] = Math.sin(angle1) * radius;

      vertices[i * 6 + 4] = Math.cos(angle2) * radius;
      vertices[i * 6 + 5] = Math.sin(angle2) * radius;
    }

    return new RenderComponent(vertices);
  }
}
