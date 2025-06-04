import { BaseGame } from "@/features/engine/scaffold/BaseGame";
import { GameConfig } from "@/features/engine/scaffold/Game";
import { World } from "@/features/engine/core/base/World";
import { PhysicsSystem } from "@/features/engine/core/systems/PhysicsSystem";
import { RenderSystem } from "@/features/engine/core/systems/RenderSystem";
import { Entity } from "@/features/engine/core/base/Entity";
import { ShipControlSystem } from "./systems/ShipControlSystem";
import { createShipEntity } from "./entities/ShipEntity";
import { ProjectileSystem } from "./systems/ProjectileSystem";
import { CollisionSystem } from "@/features/engine/core/systems/CollisionSystem";
import { AsteroidCollisionSystem } from "./systems/AsteroidCollisionCleanupSystem";
import { ParticleSystem } from "@/features/engine/core/systems/ParticleSystem";
import { ExplosionSpawnSystem } from "./systems/ExplosionSpawnSystem";
import { EmitterRenderSystem } from "@/features/engine/core/systems/EmitterRenderSystem";
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
