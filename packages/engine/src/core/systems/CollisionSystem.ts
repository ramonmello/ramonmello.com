import { System } from "../base/System";
import { Entity } from "../base/Entity";
import { TransformComponent } from "../components/TransformComponent";
import {
  ColliderComponent,
  ColliderType,
} from "../components/ColliderComponent";
import { COLLISION_EVENTS } from "../messaging/MessageTypes";

export class CollisionSystem extends System {
  readonly componentTypes = [TransformComponent.TYPE, ColliderComponent.TYPE];

  priority = 50;

  update(entities: Entity[]): void {
    const activeEntities = entities.filter((entity) => {
      const collider = entity.getComponent<ColliderComponent>(
        ColliderComponent.TYPE
      );
      return collider && collider.active;
    });

    for (let i = 0; i < activeEntities.length; i++) {
      const entityA = activeEntities[i];
      const colliderA = entityA.getComponent<ColliderComponent>(
        ColliderComponent.TYPE
      )!;

      for (let j = i + 1; j < activeEntities.length; j++) {
        const entityB = activeEntities[j];
        const colliderB = entityB.getComponent<ColliderComponent>(
          ColliderComponent.TYPE
        )!;

        if (!colliderA.canCollideWith(colliderB)) continue;

        if (this.checkCollision(entityA, entityB)) {
          this.world?.emit(COLLISION_EVENTS.DETECT, {
            entityA,
            entityB,
            colliderA,
            colliderB,
          });

          if (!colliderA.isTrigger && !colliderB.isTrigger) {
            this.world?.emit(COLLISION_EVENTS.RESOLVE, {
              entityA,
              entityB,
              colliderA,
              colliderB,
            });
          }
        }
      }
    }
  }

  private checkCollision(entityA: Entity, entityB: Entity): boolean {
    const transformA = entityA.getComponent<TransformComponent>(
      TransformComponent.TYPE
    )!;
    const colliderA = entityA.getComponent<ColliderComponent>(
      ColliderComponent.TYPE
    )!;

    const transformB = entityB.getComponent<TransformComponent>(
      TransformComponent.TYPE
    )!;
    const colliderB = entityB.getComponent<ColliderComponent>(
      ColliderComponent.TYPE
    )!;

    const posA = {
      x: transformA.position.x + colliderA.offset.x,
      y: transformA.position.y + colliderA.offset.y,
    };

    const posB = {
      x: transformB.position.x + colliderB.offset.x,
      y: transformB.position.y + colliderB.offset.y,
    };

    if (
      colliderA.colliderType === ColliderType.Circle &&
      colliderB.colliderType === ColliderType.Circle
    ) {
      return this.circleCircleCollision(
        posA,
        colliderA.radius || 0,
        posB,
        colliderB.radius || 0
      );
    }

    if (
      colliderA.colliderType === ColliderType.Rectangle &&
      colliderB.colliderType === ColliderType.Rectangle
    ) {
      return this.rectRectCollision(
        posA,
        colliderA.width || 0,
        colliderA.height || 0,
        posB,
        colliderB.width || 0,
        colliderB.height || 0
      );
    }

    if (
      colliderA.colliderType === ColliderType.Circle &&
      colliderB.colliderType === ColliderType.Rectangle
    ) {
      return this.circleRectCollision(
        posA,
        colliderA.radius || 0,
        posB,
        colliderB.width || 0,
        colliderB.height || 0
      );
    }

    if (
      colliderA.colliderType === ColliderType.Rectangle &&
      colliderB.colliderType === ColliderType.Circle
    ) {
      return this.circleRectCollision(
        posB,
        colliderB.radius || 0,
        posA,
        colliderA.width || 0,
        colliderA.height || 0
      );
    }

    return this.circleCircleCollision(
      posA,
      Math.max(colliderA.radius || 0, 10),
      posB,
      Math.max(colliderB.radius || 0, 10)
    );
  }

  private circleCircleCollision(
    posA: { x: number; y: number },
    radiusA: number,
    posB: { x: number; y: number },
    radiusB: number
  ): boolean {
    const dx = posA.x - posB.x;
    const dy = posA.y - posB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < radiusA + radiusB;
  }

  private rectRectCollision(
    posA: { x: number; y: number },
    widthA: number,
    heightA: number,
    posB: { x: number; y: number },
    widthB: number,
    heightB: number
  ): boolean {
    const halfWidthA = widthA / 2;
    const halfHeightA = heightA / 2;
    const halfWidthB = widthB / 2;
    const halfHeightB = heightB / 2;

    const leftA = posA.x - halfWidthA;
    const rightA = posA.x + halfWidthA;
    const topA = posA.y - halfHeightA;
    const bottomA = posA.y + halfHeightA;

    const leftB = posB.x - halfWidthB;
    const rightB = posB.x + halfWidthB;
    const topB = posB.y - halfHeightB;
    const bottomB = posB.y + halfHeightB;

    return !(
      rightA < leftB ||
      leftA > rightB ||
      bottomA < topB ||
      topA > bottomB
    );
  }

  private circleRectCollision(
    circlePos: { x: number; y: number },
    radius: number,
    rectPos: { x: number; y: number },
    width: number,
    height: number
  ): boolean {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const dx = Math.abs(circlePos.x - rectPos.x);
    const dy = Math.abs(circlePos.y - rectPos.y);

    if (dx > halfWidth + radius) return false;
    if (dy > halfHeight + radius) return false;

    if (dx <= halfWidth) return true;
    if (dy <= halfHeight) return true;

    const cornerDistanceSq =
      Math.pow(dx - halfWidth, 2) + Math.pow(dy - halfHeight, 2);

    return cornerDistanceSq <= Math.pow(radius, 2);
  }
}
