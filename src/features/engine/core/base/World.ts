import { Entity } from "./Entity";
import { System } from "./System";
import {
  MessageBus,
  MessageData,
  MessageHandler,
} from "../messaging/MessageBus";

/**
 * Orchestrates entities, systems, and global messaging for the application.
 */
export class World {
  /**
   * Map of all entities keyed by their unique IDs.
   * @private
   */
  private entities: Map<string, Entity> = new Map();

  /**
   * Array of registered systems to execute logic on entities.
   * @private
   */
  private systems: System[] = [];

  /**
   * Tracks the total elapsed time since the world started (in seconds).
   * @private
   */
  private elapsedTime: number = 0;

  /**
   * Stores disposal callbacks for message subscriptions.
   * @private
   */
  private messageDisposers: Array<() => void> = [];

  /**
   * Indicates whether the world update loop is currently active.
   * @private
   */
  private running: boolean = false;

  /**
   * Adds an entity to the world and emits an 'entityAdded' event.
   * @param entity - The entity instance to add.
   * @returns The world instance for method chaining.
   */
  addEntity(entity: Entity): World {
    this.entities.set(entity.id, entity);
    this.emit("entityAdded", { entity });
    return this;
  }

  /**
   * Removes and destroys an entity by its ID, then emits an 'entityRemoved' event.
   * @param id - The unique identifier of the entity to remove.
   */
  removeEntity(id: string): void {
    const entity = this.entities.get(id);
    if (entity) {
      entity.destroy();
      this.entities.delete(id);
      this.emit("entityRemoved", { entityId: id });
    }
  }

  /**
   * Retrieves an entity by its unique ID.
   * @param id - The unique identifier of the entity.
   * @returns The entity instance if found; otherwise undefined.
   */
  getEntity(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  /**
   * Returns all entities currently managed by the world.
   * @returns An array of all entity instances.
   */
  getAllEntities(): Entity[] {
    return Array.from(this.entities.values());
  }

  /**
   * Registers a system, sorts systems by priority, and invokes its init hook.
   * @param system - The system instance to add.
   * @returns The world instance for method chaining.
   */
  addSystem(system: System): World {
    system.setWorld(this);
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
    if (system.init) {
      system.init(this);
    }
    return this;
  }

  /**
   * Emits a global message via the MessageBus with world context.
   * @param messageType - Identifier for the message type.
   * @param data - Optional payload to include with the message.
   */
  emit(messageType: string, data: MessageData = {}): void {
    MessageBus.getInstance().emit(messageType, {
      world: this,
      ...data,
    });
  }

  /**
   * Subscribes to a global message and stores its disposer for later cleanup.
   * @param messageType - Identifier for the message type to listen for.
   * @param handler - Callback invoked when the message is received.
   * @returns The world instance for method chaining.
   */
  on(messageType: string, handler: MessageHandler): World {
    const disposer = MessageBus.getInstance().on(messageType, handler);
    this.messageDisposers.push(disposer);
    return this;
  }

  /**
   * Clears all stored message subscription disposers.
   */
  clearAllListeners(): void {
    this.messageDisposers.forEach((disposer) => disposer());
    this.messageDisposers = [];
  }

  /**
   * Starts the world update loop if not already running and emits 'worldStarted'.
   */
  start(): void {
    if (!this.running) {
      this.running = true;
      this.emit("worldStarted", {});
    }
  }

  /**
   * Stops the world update loop if running and emits 'worldStopped'.
   */
  stop(): void {
    if (this.running) {
      this.running = false;
      this.emit("worldStopped", {});
    }
  }

  /**
   * Executes a single update cycle: increments elapsed time, emits hooks, and processes each enabled system.
   * @param deltaTime - Time elapsed since the last update (in seconds).
   */
  update(deltaTime: number): void {
    if (!this.running) return;
    this.elapsedTime += deltaTime;
    this.emit("preUpdate", { deltaTime });
    for (const system of this.systems) {
      if (!system.enabled) continue;
      const eligibleEntities = Array.from(this.entities.values()).filter(
        (entity) => system.shouldProcessEntity(entity)
      );
      system.update(eligibleEntities, deltaTime);
    }
    this.emit("postUpdate", { deltaTime });
  }

  /**
   * Retrieves entities that have all specified component types.
   * @param componentTypes - List of component type identifiers to filter by.
   * @returns An array of matching entity instances.
   */
  getEntitiesWith(...componentTypes: string[]): Entity[] {
    return Array.from(this.entities.values()).filter((entity) =>
      componentTypes.every((type) => entity.hasComponent(type))
    );
  }

  /**
   * Returns the total elapsed time since the world started.
   * @returns Elapsed time in milliseconds.
   */
  getElapsedTime(): number {
    return this.elapsedTime;
  }

  /**
   * Clears all entities, systems, listeners, resets elapsed time, and emits 'worldCleared'.
   */
  clear(): void {
    this.entities.forEach((entity) => entity.destroy());
    this.entities.clear();
    this.systems = [];
    this.clearAllListeners();
    this.elapsedTime = 0;
    this.emit("worldCleared", {});
  }

  /**
   * Stops and clears the world, emits 'worldDestroyed', and clears all global listeners.
   */
  destroy(): void {
    this.stop();
    this.clear();
    this.emit("worldDestroyed", {});
    MessageBus.getInstance().clearAllListeners();
  }
}
