import { System } from "../base/System";
import { Entity } from "../base/Entity";
import { TransformComponent } from "../components/TransformComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { TARGET_FPS } from "../config/time";

export class PhysicsSystem extends System {
  readonly componentTypes = [TransformComponent.TYPE, PhysicsComponent.TYPE];

  priority = 10;

  update(entities: Entity[], deltaTime: number): void {
    const timeScale = deltaTime * TARGET_FPS;

    // A headless world reports a zero-sized viewport: there are no edges to
    // wrap against, so wrapping is skipped rather than collapsing to 0.
    const { width, height } = this.world?.getViewport() ?? {
      width: 0,
      height: 0,
    };
    const bounded = width > 0 && height > 0;

    entities.forEach((entity) => {
      const transform = entity.getComponent<TransformComponent>(
        TransformComponent.TYPE
      );
      const physics = entity.getComponent<PhysicsComponent>(
        PhysicsComponent.TYPE
      );

      if (!transform || !physics) return;

      physics.velocity.x += physics.acceleration.x * timeScale;
      physics.velocity.y += physics.acceleration.y * timeScale;

      physics.velocity.x *= Math.pow(physics.friction, timeScale);
      physics.velocity.y *= Math.pow(physics.friction, timeScale);

      if (physics.maxSpeed !== undefined) {
        const speed = Math.hypot(physics.velocity.x, physics.velocity.y);
        if (speed > physics.maxSpeed) {
          const factor = physics.maxSpeed / speed;
          physics.velocity.x *= factor;
          physics.velocity.y *= factor;
        }
      }

      if (Math.abs(physics.velocity.x) < 0.001) physics.velocity.x = 0;
      if (Math.abs(physics.velocity.y) < 0.001) physics.velocity.y = 0;

      transform.position.x += physics.velocity.x * timeScale;
      transform.position.y += physics.velocity.y * timeScale;

      transform.rotation += physics.angularVelocity * timeScale;

      transform.rotation = transform.rotation % (Math.PI * 2);
      if (transform.rotation < 0) transform.rotation += Math.PI * 2;

      if (physics.wrapAroundEdges && bounded) {
        if (transform.position.x < 0) transform.position.x += width;
        if (transform.position.x > width) transform.position.x -= width;
        if (transform.position.y < 0) transform.position.y += height;
        if (transform.position.y > height) transform.position.y -= height;
      }

      physics.acceleration.x = 0;
      physics.acceleration.y = 0;
    });
  }
}
