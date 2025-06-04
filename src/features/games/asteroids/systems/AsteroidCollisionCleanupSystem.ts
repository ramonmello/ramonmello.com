import { System } from "@/features/engine/core/base/System";
import { World } from "@/features/engine/core/base/World";
import { Entity } from "@/features/engine/core/base/Entity";
import {
  COLLISION_EVENTS,
  WORLD_EVENTS,
  PROJECTILE_EVENTS,
  PLAYER_EVENTS,
  ENTITY_EVENTS,
} from "@/features/engine/core/messaging/MessageTypes";
import { ProjectileComponent } from "../components/ProjectileComponent";
import { ShipComponent } from "../components/ShipComponent";
import { MessageData } from "@/features/engine/core/messaging/MessageBus";
import { TransformComponent } from "@/features/engine/core/components/TransformComponent";
import { AsteroidComponent } from "../components/AsteroidComponent";

export class AsteroidCollisionSystem extends System {
  readonly componentTypes: string[] = [];

  priority = 0;

  private pendingRemovals = new Set<string>();

  init(world: World): void {
    this.world = world;

    world.on(COLLISION_EVENTS.DETECT, this.handleCollision);
    world.on(WORLD_EVENTS.POST_UPDATE, this.flushRemovals);
  }

  update(): void {}

  private isAsteroid = (e: Entity) => e.hasComponent(AsteroidComponent.TYPE);

  private handleCollision = (data: MessageData): void => {
    const entityA = data.entityA as Entity;
    const entityB = data.entityB as Entity;

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

      this.markForRemoval(projectile);
      this.markForRemoval(asteroid);

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

      this.markForRemoval(ship);

      const s = ship.getComponent<TransformComponent>(TransformComponent.TYPE);

      ship.emit(PLAYER_EVENTS.DIE, {
        position: { x: s?.position.x, y: s?.position.y },
      });
    }
  };

  private markForRemoval(entity: Entity): void {
    this.pendingRemovals.add(entity.id);
  }

  private flushRemovals = (): void => {
    for (const id of this.pendingRemovals) {
      const entity = this.world?.getEntity(id);
      if (entity) {
        if (this.isAsteroid(entity)) {
          this.world?.emit(ENTITY_EVENTS.DESTROYED, { entity });
        }
        this.world?.removeEntity(id);
      }
    }
    this.pendingRemovals.clear();
  };
}
