import { System } from "@engine/core/base/System";
import { PhysicsComponent } from "@engine/core/components/PhysicsComponent";
import { TransformComponent } from "@engine/core/components/TransformComponent";
import { ShipComponent } from "../components/ShipComponent";
import { AsteroidsGame } from "@games/asteroids/asteroidsGame";
import { Entity } from "@engine/core/base/Entity";
import { PLAYER_EVENTS } from "@engine/core/messaging/MessageTypes";
import { TARGET_FPS } from "@engine/core/config/time";

export class ShipControlSystem extends System {
  readonly componentTypes = [
    TransformComponent.TYPE,
    PhysicsComponent.TYPE,
    ShipComponent.TYPE,
  ];

  priority = 1;

  private game: AsteroidsGame;

  private prevFiring = false;

  constructor(game: AsteroidsGame) {
    super();
    this.game = game;
  }

  update(entities: Entity[], deltaTime: number): void {
    const timeScale = deltaTime * TARGET_FPS;

    const inputSystem = this.game?.getInputSystem();
    if (!inputSystem) return;

    entities.forEach((entity) => {
      const transform = entity.getComponent<TransformComponent>(
        TransformComponent.TYPE
      );
      const physics = entity.getComponent<PhysicsComponent>(
        PhysicsComponent.TYPE
      );
      const player = entity.getComponent<ShipComponent>(ShipComponent.TYPE);

      if (!transform || !physics || !player) return;

      player.update(deltaTime);

      const direction = inputSystem.getDirection();
      const actions = inputSystem.getActions();

      if (direction.x !== 0) {
        const rotationAmount = player.rotationSpeed * direction.x * timeScale;
        transform.rotate(rotationAmount);
      }

      if (direction.y < 0) {
        player.thrusting = true;

        const thrustX = -Math.sin(transform.rotation) * player.thrustPower;
        const thrustY = Math.cos(transform.rotation) * player.thrustPower;

        physics.applyForce(thrustX, thrustY);

        player.updateTrail(transform.position, transform.rotation);
      } else {
        player.thrusting = false;
      }

      if (actions.fire && !this.prevFiring && player.canShoot()) {
        player.shoot();

        entity.emit(PLAYER_EVENTS.FIRE, {
          position: { ...transform.position },
          rotation: transform.rotation,
          velocity: { ...physics.velocity },
        });
      }

      this.prevFiring = actions.fire;
    });
  }
}
