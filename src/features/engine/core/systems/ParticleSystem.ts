import { System } from "../base/System";
import { Entity } from "../base/Entity";
import { TransformComponent } from "../components/TransformComponent";
import { ParticleEmitterComponent } from "../components/ParticleEmitterComponent";

export class ParticleSystem extends System {
  readonly componentTypes = [
    TransformComponent.TYPE,
    ParticleEmitterComponent.TYPE,
  ];

  priority = 15;

  update(entities: Entity[], dt: number): void {
    entities.forEach((e) => {
      //   const t = e.getComponent<TransformComponent>(TransformComponent.TYPE)!;
      const pe = e.getComponent<ParticleEmitterComponent>(
        ParticleEmitterComponent.TYPE
      )!;

      pe.elapsed += dt;

      pe.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life += dt;
      });

      pe.particles = pe.particles.filter((p) => p.life < p.maxLife);

      if (pe.elapsed >= pe.maxLifetime && pe.particles.length === 0) {
        this.world?.removeEntity(e.id);
      }
    });
  }
}
