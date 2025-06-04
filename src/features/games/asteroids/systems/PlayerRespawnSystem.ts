// engine/core/systems/PlayerRespawnSystem.ts
import { System } from "@/features/engine/core/base/System";
import { MessageBus } from "@/features/engine/core/messaging/MessageBus";
import { PLAYER_EVENTS } from "@/features/engine/core/messaging/MessageTypes";
import { World } from "@/features/engine/core/base/World";
import { createShipEntity } from "@/features/games/asteroids/entities/ShipEntity"; // sua factory atual

export class PlayerRespawnSystem extends System {
  readonly componentTypes: string[] = []; // não processa entidades

  private respawnDelay = 1.5 * 1000;
  protected world!: World;

  init(world: World): void {
    this.world = world;

    MessageBus.getInstance().on(PLAYER_EVENTS.DIE, () => {
      setTimeout(() => {
        const player = createShipEntity();
        this.world.addEntity(player);
        MessageBus.getInstance().emit(PLAYER_EVENTS.RESPAWN, {
          entity: player,
        });
      }, this.respawnDelay);
    });
  }

  update(): void {}
}
