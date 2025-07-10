import { System } from "@engine/core/base/System";
import { Entity } from "@engine/core/base/Entity";
import { World } from "@engine/core/base/World";
import { createAsteroidEntity } from "../entities/AsteroidEntity";
import {
  GAME_EVENTS,
  ENTITY_EVENTS,
} from "@engine/core/messaging/MessageTypes";
import { MessageData } from "@engine/core/messaging/MessageBus";
import { AsteroidComponent } from "../components/AsteroidComponent";

export class WaveSystem extends System {
  readonly componentTypes: string[] = [];
  private baseAsteroids = 1;
  private wave = 0;
  priority: number = 130;

  private remaining = 0;

  init(world: World): void {
    this.startNewWave(world);
    world.on(ENTITY_EVENTS.DESTROYED, (data: MessageData) => {
      const entity = data.entity as Entity;
      if (entity && entity.hasComponent(AsteroidComponent.TYPE)) {
        this.remaining--;
        console.log(`Asteroid destroyed! Remaining: ${this.remaining}`);
      }
    });
  }

  update(): void {
    if (this.remaining === 0) {
      this.startNewWave(this.world!);
    }
  }

  private startNewWave(world: World): void {
    const increase = ++this.wave * 3;
    const n = this.baseAsteroids + increase;
    for (let i = 0; i < n; i++) {
      world.addEntity(createAsteroidEntity());
    }
    this.remaining = n;
    console.log(`Wave ${this.wave} started with ${n} asteroids`);
    world.emit(GAME_EVENTS.LEVEL_CHANGED, { wave: this.wave, asteroids: n });
  }
}
