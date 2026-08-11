import { Entity } from "./Entity";
import { System, SystemPhase } from "./System";
import {
  MessageBus,
  MessageData,
  MessageHandler,
} from "../messaging/MessageBus";
import type { CanvasSize } from "../rendering/canvasSize";
import type { WebGLContext } from "../rendering/Context";

export interface WorldOptions {
  /** Bus to share with another world. Defaults to a fresh, private one. */
  messageBus?: MessageBus;

  /** Surface the rendering systems draw to. Absent means headless. */
  renderContext?: WebGLContext;
}

/**
 * Orchestrates entities, systems, and messaging for one running game.
 *
 * Everything a system may reach for at runtime hangs off the world instance —
 * the message bus and the render context included — so two worlds can run side
 * by side without sharing anything.
 */
export class World {
  /**
   * Message bus scoped to this world.
   * @private
   */
  private readonly messageBus: MessageBus;

  /**
   * Render surface handed to the rendering systems, when there is one.
   * @private
   */
  private renderContext?: WebGLContext;

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

  constructor(options: WorldOptions = {}) {
    this.messageBus = options.messageBus ?? new MessageBus();
    this.renderContext = options.renderContext;
  }

  /**
   * Returns the bus every entity and system of this world publishes on.
   */
  getMessageBus(): MessageBus {
    return this.messageBus;
  }

  /**
   * Points the world at a render surface, or at nothing to go headless.
   * @param renderContext - The context the rendering systems should draw to.
   */
  setRenderContext(renderContext?: WebGLContext): void {
    this.renderContext = renderContext;
  }

  /**
   * Returns the render surface, or undefined when the world runs headless.
   */
  getRenderContext(): WebGLContext | undefined {
    return this.renderContext;
  }

  /**
   * Drawing-buffer size of the render surface. A headless world reports
   * zeroes, which callers should read as "no bounds to play against".
   */
  getViewport(): CanvasSize {
    const canvas = this.renderContext?.canvas;
    return { width: canvas?.width ?? 0, height: canvas?.height ?? 0 };
  }

  /**
   * Adds an entity to the world, wires it to the world's bus, and emits an
   * 'entityAdded' event.
   * @param entity - The entity instance to add.
   * @returns The world instance for method chaining.
   */
  addEntity(entity: Entity): World {
    this.entities.set(entity.id, entity);
    entity.setMessageBus(this.messageBus);
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
   * Emits a message on this world's bus, with world context attached.
   * @param messageType - Identifier for the message type.
   * @param data - Optional payload to include with the message.
   */
  emit(messageType: string, data: MessageData = {}): void {
    this.messageBus.emit(messageType, {
      world: this,
      ...data,
    });
  }

  /**
   * Subscribes to a message on this world's bus and stores its disposer for
   * later cleanup.
   * @param messageType - Identifier for the message type to listen for.
   * @param handler - Callback invoked when the message is received.
   * @returns The world instance for method chaining.
   */
  on(messageType: string, handler: MessageHandler): World {
    const disposer = this.messageBus.on(messageType, handler);
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
   * Advances the simulation by one step: refreshes the per-step state of every
   * component, moves the clock, emits the hooks, and runs each enabled
   * simulation system. Drawing is a separate pass — see {@link render}.
   * @param deltaTime - Time elapsed since the last update (in seconds).
   */
  update(deltaTime: number): void {
    if (!this.running) return;
    this.elapsedTime += deltaTime;
    this.entities.forEach((entity) => entity.beginStep());
    this.emit("preUpdate", { deltaTime });
    this.runSystems("simulation", deltaTime);
    this.emit("postUpdate", { deltaTime });
  }

  /**
   * Draws the world once, running the render systems and nothing else.
   * @param alpha - How far past the last simulated step this frame sits, in
   * `[0, 1)`. Render systems blend the poses of the two surrounding steps by
   * it, so motion stays smooth on displays whose refresh rate is not the
   * simulation's step rate.
   */
  render(alpha: number = 0): void {
    if (!this.running) return;
    this.runSystems("render", alpha);
  }

  private runSystems(phase: SystemPhase, deltaTime: number): void {
    for (const system of this.systems) {
      if (!system.enabled || system.phase !== phase) continue;
      const eligibleEntities = Array.from(this.entities.values()).filter(
        (entity) => system.shouldProcessEntity(entity)
      );
      system.update(eligibleEntities, deltaTime);
    }
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
   * Stops and clears the world, emits 'worldDestroyed', and wipes this world's
   * bus — including subscriptions taken out directly on it. Other worlds keep
   * their own listeners.
   */
  destroy(): void {
    this.stop();
    this.clear();
    this.emit("worldDestroyed", {});
    this.messageBus.clearAllListeners();
    this.renderContext = undefined;
  }
}
