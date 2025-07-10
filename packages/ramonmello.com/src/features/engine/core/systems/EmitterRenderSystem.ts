import { System } from "../base/System";
import { Entity } from "../base/Entity";
import { ParticleEmitterComponent } from "../components/ParticleEmitterComponent";
import { TransformComponent } from "../components/TransformComponent";
import { getWebGLContext } from "../rendering/Context";

export class EmitterRenderSystem extends System {
  readonly componentTypes = [
    TransformComponent.TYPE,
    ParticleEmitterComponent.TYPE,
  ];

  priority = 110;

  private static readonly QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  update(entities: Entity[]): void {
    const { gl, canvas, positionBuffer, locs } = getWebGLContext();

    entities.forEach((e) => {
      const base = e.getComponent<TransformComponent>(TransformComponent.TYPE)!;
      const pe = e.getComponent<ParticleEmitterComponent>(
        ParticleEmitterComponent.TYPE
      )!;

      pe.particles.forEach((p) => {
        const alpha = 1 - p.life / p.maxLife;

        gl.useProgram(locs.program);

        gl.uniform2f(locs.u_resolution, canvas.width, canvas.height);
        gl.uniform1f(locs.u_rotation, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const scaled = EmitterRenderSystem.QUAD.map((v) => v * p.size);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(scaled),
          gl.STATIC_DRAW
        );
        gl.enableVertexAttribArray(locs.a_position);
        gl.vertexAttribPointer(locs.a_position, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(
          locs.u_translation,
          base.position.x + p.x,
          base.position.y + p.y
        );
        gl.uniform4f(locs.u_color, 1, 1, 1, alpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });
    });
  }
}
