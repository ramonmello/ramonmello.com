import { World } from "../core/base/World";
import { Game, GameConfig } from "./Game";
import { InputSystem } from "../core/input/InputSystem";
import { GAME_EVENTS } from "../core/messaging/MessageTypes";

export abstract class BaseGame implements Game {
  abstract name: string;

  abstract description: string;

  protected world: World;

  protected config: GameConfig;

  protected initialized: boolean = false;

  protected running: boolean = false;

  protected inputSystem?: InputSystem;

  constructor() {
    this.world = new World();
    this.config = this.getDefaultConfig();
  }

  protected abstract getDefaultConfig(): GameConfig;

  protected abstract createSystems(): void;

  protected abstract createEntities(): void;

  setInputSystem(inputSystem: InputSystem): void {
    this.inputSystem = inputSystem;
  }

  getInputSystem(): InputSystem | undefined {
    return this.inputSystem;
  }

  async initialize(world?: World, config?: Partial<GameConfig>): Promise<void> {
    if (world) {
      this.world = world;
    }

    if (config) {
      this.config = { ...this.config, ...config };
    }

    this.createSystems();

    this.createEntities();

    this.initialized = true;

    this.world.emit(GAME_EVENTS.INITIALIZED, { game: this });
  }

  start(): void {
    if (!this.initialized) {
      throw new Error(
        "O jogo não foi inicializado. Chame initialize() primeiro."
      );
    }

    this.world.start();
    this.running = true;

    this.world.emit(GAME_EVENTS.STARTED, { game: this });
  }

  pause(): void {
    if (this.running) {
      this.world.stop();
      this.running = false;

      this.world.emit(GAME_EVENTS.PAUSED, { game: this });
    }
  }

  resume(): void {
    if (!this.running && this.initialized) {
      this.world.start();
      this.running = true;

      this.world.emit(GAME_EVENTS.RESUMED, { game: this });
    }
  }

  stop(): void {
    if (this.initialized) {
      this.world.stop();
      this.running = false;

      this.world.emit(GAME_EVENTS.STOPPED, { game: this });
    }
  }

  async restart(): Promise<void> {
    this.stop();
    this.world.clear();
    await this.initialize(undefined, this.config);
    this.start();

    this.world.emit(GAME_EVENTS.RESTARTED, { game: this });
  }

  getWorld(): World {
    return this.world;
  }

  getConfig(): GameConfig {
    return this.config;
  }

  isRunning(): boolean {
    return this.running;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
