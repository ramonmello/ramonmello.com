// engine/core/systems/PlayerRespawnSystem.ts
import { System } from "@engine/core/base/System";
import { MessageBus } from "@engine/core/messaging/MessageBus";
import { PLAYER_EVENTS } from "@engine/core/messaging/MessageTypes";
import { World } from "@engine/core/base/World";
import { createShipEntity } from "@games/asteroids/entities/ShipEntity";

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
