import type { Component } from "./Component";
import type { Entity } from "./Entity";
import type { World } from "./World";

/**
 * A structural change to the world, recorded instead of performed.
 *
 * Everything that adds or drops an entity — or a component of one — is a
 * command, because those are the mutations that invalidate a query while a
 * system is iterating it.
 */
export type Command =
  | { kind: "spawn"; entity: Entity }
  | { kind: "destroy"; entityId: string }
  | { kind: "addComponent"; entityId: string; component: Component }
  | { kind: "removeComponent"; entityId: string; componentType: string };

/**
 * Queue of structural changes to apply at the end of the step.
 *
 * A system that removes an entity in the middle of its own `update()` is
 * mutating the collection the world is walking. Recording the intent and
 * replaying it at a single point in the frame makes that safe by contract:
 * every system of a step sees the same world, and the changes all land
 * together, in the order they were asked for.
 *
 * Each world owns one, reachable as {@link World.commands}.
 */
export class CommandBuffer {
  /**
   * Commands recorded so far, in the order they were enqueued.
   * @private
   */
  private pending: Command[] = [];

  /**
   * Ids with a pending destroy, so {@link World.isAlive} can answer for an
   * entity that is still in the map but already condemned.
   * @private
   */
  private destroying: Set<string> = new Set();

  constructor(private readonly world: World) {}

  /**
   * Queues an entity to join the world.
   * @param entity - The entity to add once the buffer is flushed.
   */
  spawn(entity: Entity): void {
    this.pending.push({ kind: "spawn", entity });
    this.destroying.delete(entity.id);
  }

  /**
   * Queues an entity for removal. Queuing the same id twice is harmless: the
   * second apply finds nothing to remove and emits nothing.
   * @param entityId - The unique identifier of the entity to remove.
   */
  destroy(entityId: string): void {
    this.pending.push({ kind: "destroy", entityId });
    this.destroying.add(entityId);
  }

  /**
   * Queues a component to be attached to an entity.
   * @param entityId - The entity that should receive the component.
   * @param component - The component instance to attach.
   */
  addComponent(entityId: string, component: Component): void {
    this.pending.push({ kind: "addComponent", entityId, component });
  }

  /**
   * Queues a component to be detached from an entity.
   * @param entityId - The entity to take the component from.
   * @param componentType - The type identifier of the component to remove.
   */
  removeComponent(entityId: string, componentType: string): void {
    this.pending.push({ kind: "removeComponent", entityId, componentType });
  }

  /**
   * Whether this entity has a destroy waiting in the queue.
   * @param entityId - The unique identifier to check.
   */
  isDestroying(entityId: string): boolean {
    return this.destroying.has(entityId);
  }

  /**
   * Number of commands waiting to be applied.
   */
  get size(): number {
    return this.pending.length;
  }

  /**
   * Applies every recorded command, in enqueue order, and empties the queue.
   *
   * The batch is taken before the first command runs, so whatever the applied
   * changes provoke — an `entityRemoved` handler queuing another destroy, say —
   * waits for the next flush instead of extending this one. That keeps a chain
   * of reactions from turning into an unbounded loop inside a single step.
   *
   * Called by {@link World.update}; call it by hand only when driving a world
   * step by step outside the engine loop.
   */
  flush(): void {
    if (this.pending.length === 0) return;

    const batch = this.pending;
    this.pending = [];
    this.destroying.clear();

    for (const command of batch) {
      this.apply(command);
    }
  }

  /**
   * Drops every recorded command without applying it.
   */
  clear(): void {
    this.pending = [];
    this.destroying.clear();
  }

  private apply(command: Command): void {
    switch (command.kind) {
      case "spawn":
        this.world.addEntity(command.entity);
        break;
      case "destroy":
        this.world.removeEntity(command.entityId);
        break;
      case "addComponent":
        this.world.getEntity(command.entityId)?.addComponent(command.component);
        break;
      case "removeComponent":
        this.world
          .getEntity(command.entityId)
          ?.removeComponent(command.componentType);
        break;
    }
  }
}
