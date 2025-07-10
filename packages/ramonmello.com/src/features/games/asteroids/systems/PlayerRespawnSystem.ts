// engine/core/systems/PlayerRespawnSystem.ts
import { System, World, MessageBus, PLAYER_EVENTS } from "@engine/index";
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
