import { System } from "../base/System";
import { Entity } from "../base/Entity";
import { TransformComponent } from "../components/TransformComponent";
import { RenderComponent } from "../components/RenderComponent";
import { getWebGLContext } from "../rendering/Context";

export class RenderSystem extends System {
  readonly componentTypes = [TransformComponent.TYPE, RenderComponent.TYPE];

  priority = 100;

  private clearScreen: boolean = true;

  private backgroundColor: [number, number, number, number] = [0, 0, 0, 1];

  constructor(
    clearScreen: boolean = true,
    backgroundColor: [number, number, number, number] = [0, 0, 0, 1]
  ) {
    super();
    this.clearScreen = clearScreen;
    this.backgroundColor = backgroundColor;
  }

  update(entities: Entity[]): void {
    const { gl, canvas, positionBuffer, locs } = getWebGLContext();

    if (this.clearScreen) {
      gl.clearColor(
        this.backgroundColor[0],
        this.backgroundColor[1],
        this.backgroundColor[2],
        this.backgroundColor[3]
      );
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const orderedEntities = entities
      .filter((entity) => {
        const render = entity.getComponent<RenderComponent>(
          RenderComponent.TYPE
        );
        return render && render.visible;
      })
      .sort((a, b) => {
        const renderA = a.getComponent<RenderComponent>(RenderComponent.TYPE);
        const renderB = b.getComponent<RenderComponent>(RenderComponent.TYPE);
        if (!renderA || !renderB) return 0;
        return renderA.zIndex - renderB.zIndex;
      });

    orderedEntities.forEach((entity) => {
      const transform = entity.getComponent<TransformComponent>(
        TransformComponent.TYPE
      );
      const render = entity.getComponent<RenderComponent>(RenderComponent.TYPE);

      if (!transform || !render || !locs) return;

      gl.useProgram(locs.program);

      gl.uniform2f(locs.u_resolution, canvas.width, canvas.height);
      gl.uniform2f(
        locs.u_translation,
        transform.position.x,
        transform.position.y
      );
      gl.uniform1f(locs.u_rotation, transform.rotation);
      gl.uniform4f(
        locs.u_color,
        render.color.r,
        render.color.g,
        render.color.b,
        render.color.a
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, render.vertices, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(locs.a_position);
      gl.vertexAttribPointer(locs.a_position, 2, gl.FLOAT, false, 0, 0);

      let drawMode: number;
      switch (render.drawMode) {
        case "line_loop":
          drawMode = gl.LINE_LOOP;
          break;
        case "lines":
          drawMode = gl.LINES;
          break;
        case "points":
          drawMode = gl.POINTS;
          break;
        case "triangles":
        default:
          drawMode = gl.TRIANGLES;
          break;
      }

      gl.drawArrays(drawMode, 0, render.vertices.length / 2);
    });
  }

  setClearScreen(clear: boolean): void {
    this.clearScreen = clear;
  }

  setBackgroundColor(r: number, g: number, b: number, a: number = 1): void {
    this.backgroundColor = [r, g, b, a];
  }
}
