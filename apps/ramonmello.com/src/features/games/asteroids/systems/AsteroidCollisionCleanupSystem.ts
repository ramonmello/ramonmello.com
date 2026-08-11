import { World, Entity, System } from "@engine/core";
import {
  COLLISION_EVENTS,
  PROJECTILE_EVENTS,
  PLAYER_EVENTS,
  ENTITY_EVENTS,
} from "@engine/core";
import { ProjectileComponent } from "../components/ProjectileComponent";
import { ShipComponent } from "../components/ShipComponent";
import { MessageData, TransformComponent } from "@engine/core";
import { AsteroidComponent } from "../components/AsteroidComponent";

export class AsteroidCollisionSystem extends System {
  readonly componentTypes: string[] = [];

  priority = 0;

  init(world: World): void {
    this.world = world;

    world.on(COLLISION_EVENTS.DETECT, this.handleCollision);
  }

  update(): void {}

  private isAsteroid = (e: Entity) => e.hasComponent(AsteroidComponent.TYPE);

  private handleCollision = (data: MessageData): void => {
    const entityA = data.entityA as Entity;
    const entityB = data.entityB as Entity;

    // The same step can report an asteroid hit by two projectiles. Only the
    // first pair scores: the rest find it already queued for destruction.
    if (!this.isAlive(entityA) || !this.isAlive(entityB)) return;

    const projA = entityA.getComponent<ProjectileComponent>(
      ProjectileComponent.TYPE
    );
    const projB = entityB.getComponent<ProjectileComponent>(
      ProjectileComponent.TYPE
    );

    if (
      (projA && this.isAsteroid(entityB)) ||
      (projB && this.isAsteroid(entityA))
    ) {
      const projectile = projA ? entityA : entityB;
      const asteroid = this.isAsteroid(entityA) ? entityA : entityB;

      const t = asteroid.getComponent<TransformComponent>(
        TransformComponent.TYPE
      );
      if (t) {
        this.world?.emit(PROJECTILE_EVENTS.HIT, {
          position: { x: t.position.x, y: t.position.y },
          projectile,
          asteroid,
        });
      }

      this.world?.emit(ENTITY_EVENTS.DESTROYED, { entity: asteroid });
      this.destroy(projectile);
      this.destroy(asteroid);
      return;
    }

    const shipA = entityA.getComponent<ShipComponent>(ShipComponent.TYPE);
    const shipB = entityB.getComponent<ShipComponent>(ShipComponent.TYPE);

    if (
      (shipA && this.isAsteroid(entityB)) ||
      (shipB && this.isAsteroid(entityA))
    ) {
      const ship = shipA ? entityA : entityB;
      const shipComp = shipA ? shipA : shipB!;

      if (shipComp.invincible) return; // colisão ignorada se invencível

      const s = ship.getComponent<TransformComponent>(TransformComponent.TYPE);

      ship.emit(PLAYER_EVENTS.DIE, {
        position: { x: s?.position.x, y: s?.position.y },
      });

      this.destroy(ship);
    }
  };

  private isAlive(entity: Entity): boolean {
    return this.world?.isAlive(entity.id) ?? false;
  }

  private destroy(entity: Entity): void {
    this.world?.commands.destroy(entity.id);
  }
}
