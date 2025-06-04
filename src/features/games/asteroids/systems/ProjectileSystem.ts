import { System } from "@/features/engine/core/base/System";
import { Entity } from "@/features/engine/core/base/Entity";
import { World } from "@/features/engine/core/base/World";
import { TransformComponent } from "@/features/engine/core/components/TransformComponent";
import { RenderComponent } from "@/features/engine/core/components/RenderComponent";
import { PhysicsComponent } from "@/features/engine/core/components/PhysicsComponent";
import { ColliderComponent } from "@/features/engine/core/components/ColliderComponent";
import { ProjectileComponent } from "@/features/games/asteroids/components/ProjectileComponent";
import {
  PLAYER_EVENTS,
  PROJECTILE_EVENTS,
} from "@/features/engine/core/messaging/MessageTypes";
import { MessageData } from "@/features/engine/core/messaging/MessageBus";

interface FireData extends MessageData {
  position: { x: number; y: number };
  rotation: number;
  velocity?: { x: number; y: number };
  sourceEntity: Entity;
}

export class ProjectileSystem extends System {
  readonly componentTypes = [
    TransformComponent.TYPE,
    PhysicsComponent.TYPE,
    ProjectileComponent.TYPE,
  ];

  priority = 20;

  private static readonly CONFIG = {
    SPEED: 7,
    LIFESPAN: 1.5,
    SIZE: 3,
    OFFSET_DISTANCE: 20,
  };

  constructor(world: World) {
    super();
    this.world = world;
    this.registerEventListeners();
  }

  private registerEventListeners(): void {
    if (!this.world) return;

    this.world.on(PLAYER_EVENTS.FIRE, (data: MessageData) => {
      this.createProjectile(data as FireData);
    });
  }

  update(entities: Entity[], deltaTime: number): void {
    entities.forEach((entity) => this.updateProjectile(entity, deltaTime));
  }

  private updateProjectile(entity: Entity, deltaTime: number): void {
    const projectile = entity.getComponent<ProjectileComponent>(
      ProjectileComponent.TYPE
    );

    if (!projectile) return;

    const expired = projectile.update(deltaTime);

    if (expired && this.world) {
      entity.emit(PROJECTILE_EVENTS.EXPIRE, { entity });

      this.world.removeEntity(entity.id);
    }
  }

  private createProjectile(data: FireData): void {
    if (!this.world) return;

    const { position, rotation, velocity: shipVelocity, sourceEntity } = data;

    const initialPosition = this.calculateProjectilePosition(
      position,
      rotation
    );
    const projectileVelocity = this.calculateProjectileVelocity(
      rotation,
      shipVelocity
    );

    const projectile = this.createProjectileEntity(
      initialPosition,
      rotation,
      projectileVelocity,
      sourceEntity
    );

    this.world.addEntity(projectile);
  }

  private calculateProjectilePosition(
    position: { x: number; y: number },
    rotation: number
  ): { x: number; y: number } {
    const { OFFSET_DISTANCE } = ProjectileSystem.CONFIG;

    const offsetX = -Math.sin(rotation) * OFFSET_DISTANCE;
    const offsetY = Math.cos(rotation) * OFFSET_DISTANCE;

    return {
      x: position.x + offsetX,
      y: position.y + offsetY,
    };
  }

  private calculateProjectileVelocity(
    rotation: number,
    shipVelocity?: { x: number; y: number }
  ): { x: number; y: number } {
    const { SPEED } = ProjectileSystem.CONFIG;

    const projectileVelocityX = -Math.sin(rotation) * SPEED;
    const projectileVelocityY = Math.cos(rotation) * SPEED;

    return {
      x: projectileVelocityX + (shipVelocity?.x || 0),
      y: projectileVelocityY + (shipVelocity?.y || 0),
    };
  }

  private createProjectileEntity(
    position: { x: number; y: number },
    rotation: number,
    velocity: { x: number; y: number },
    sourceEntity: Entity
  ): Entity {
    const { SIZE, LIFESPAN } = ProjectileSystem.CONFIG;

    const projectile = new Entity();

    const transform = new TransformComponent(position.x, position.y, rotation);

    const physics = new PhysicsComponent(1.0, true, 0.1);
    physics.setVelocity(velocity.x, velocity.y);
    physics.angularVelocity = 0;

    const render = RenderComponent.createRectangle(SIZE, SIZE);
    render.setColor(1, 1, 1, 1);

    const collider = ColliderComponent.createCircle(SIZE);
    // collider.setTrigger(true);

    const projectileComponent = new ProjectileComponent(
      LIFESPAN,
      1,
      sourceEntity
    );

    projectile
      .addComponent(transform)
      .addComponent(physics)
      .addComponent(render)
      .addComponent(collider)
      .addComponent(projectileComponent);

    return projectile;
  }
}
