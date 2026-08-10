import { System, World, PLAYER_EVENTS } from "@engine/core";
import { createShipEntity } from "@games/asteroids/entities/ShipEntity";

export class PlayerRespawnSystem extends System {
  readonly componentTypes: string[] = []; // não processa entidades

  private respawnDelay = 1.5 * 1000;
  protected world!: World;

  init(world: World): void {
    this.world = world;

    // Via world.on: o disposer fica com o World e cai junto no clear/destroy,
    // em vez de sobreviver solto num barramento de processo.
    world.on(PLAYER_EVENTS.DIE, () => {
      setTimeout(() => {
        const player = createShipEntity(this.world.getViewport());
        this.world.addEntity(player);
        this.world.emit(PLAYER_EVENTS.RESPAWN, { entity: player });
      }, this.respawnDelay);
    });
  }

  update(): void {}
}
