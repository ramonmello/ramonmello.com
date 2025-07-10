import { BaseGame, GameConfig } from "@engine/scaffold";
import { World, Entity, PhysicsSystem, RenderSystem } from "@engine/index";
import { ShipControlSystem } from "./systems/ShipControlSystem";
import { createShipEntity } from "./entities/ShipEntity";
import { ProjectileSystem } from "./systems/ProjectileSystem";
import {
  CollisionSystem,
  ParticleSystem,
  EmitterRenderSystem,
} from "@engine/index";
import { AsteroidCollisionSystem } from "./systems/AsteroidCollisionCleanupSystem";
import { ExplosionSpawnSystem } from "./systems/ExplosionSpawnSystem";
import { WaveSystem } from "./systems/WaveSystem";
import { PlayerRespawnSystem } from "./systems/PlayerRespawnSystem";

export interface AsteroidsGameConfig extends GameConfig {
  rotationSpeed: number;
  thrustForce: number;
}

export class AsteroidsGame extends BaseGame {
  name = "Asteroids";

  description = "Arcade-style, multidirectional space shooter";

  private shipEntity?: Entity;

  protected getDefaultConfig(): AsteroidsGameConfig {
    return {
      canvasWidth: 800,
      canvasHeight: 600,
      debug: false,
      rotationSpeed: 0.05,
      thrustForce: 0.1,
    };
  }

  getConfig(): AsteroidsGameConfig {
    return this.config as AsteroidsGameConfig;
  }

  async initialize(world?: World, config?: Partial<GameConfig>): Promise<void> {
    await super.initialize(world, config);
  }

  protected createSystems(): void {
    this.world.addSystem(new PhysicsSystem());

    /* efeitos */
    this.world.addSystem(new ParticleSystem()); // novo
    this.world.addSystem(new ExplosionSpawnSystem(this.world)); // novo
    this.world.addSystem(new EmitterRenderSystem()); // novo

    this.world.addSystem(new RenderSystem(true, [0, 0, 0, 0]));

    this.world.addSystem(new ShipControlSystem(this));
    this.world.addSystem(new ProjectileSystem(this.world));

    this.world.addSystem(new CollisionSystem());
    this.world.addSystem(new AsteroidCollisionSystem());

    this.world.addSystem(new WaveSystem());
    this.world.addSystem(new PlayerRespawnSystem());
  }

  private createShip(): void {
    this.shipEntity = createShipEntity();
    this.world.addEntity(this.shipEntity);
  }

  protected createEntities(): void {
    this.createShip();
  }
}
