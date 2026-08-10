import { Component } from "../base/Component";
import {
  MessageBus,
  MessageData,
  MessageHandler,
} from "../messaging/MessageBus";

/**
 * Represents an entity in the ECS.
 * Entities serve as containers for components and handle messaging.
 */
export class Entity {
  /**
   * Unique identifier for this entity.
   */
  id: string;

  /**
   * Registry of components attached to this entity, keyed by component type.
   */
  components: Map<string, Component>;

  /**
   * Optional human-readable name for debugging or identification.
   */
  name?: string;

  /**
   * Bus this entity publishes on, assigned by {@link World.addEntity}.
   */
  private messageBus?: MessageBus;

  /**
   * Subscriptions taken out on this entity, kept so they can be re-registered
   * when the entity is attached to a bus (or moved to another one).
   */
  private subscriptions: Array<{
    messageType: string;
    handler: MessageHandler;
  }> = [];

  /**
   * Internal disposers for message subscriptions to allow cleanup.
   */
  private messageDisposers: Array<() => void> = [];

  /**
   * Creates a new Entity instance.
   * @param id - Optional unique identifier; uses a generated UUID if omitted.
   * @param name - Optional name for the entity.
   */
  constructor(id?: string, name?: string) {
    this.id = id || crypto.randomUUID();
    this.components = new Map();
    this.name = name;
  }

  /**
   * Attaches a component to this entity and invokes its onAttach hook.
   * @param component - The component instance to add.
   * @returns This entity, for method chaining.
   */
  addComponent(component: Component): Entity {
    component.entity = this;
    this.components.set(component.type, component);

    if (component.onAttach) {
      component.onAttach();
    }

    return this;
  }

  /**
   * Retrieves a component by its type identifier.
   * @typeParam T - Expected component subclass.
   * @param type - The type identifier of the component.
   * @returns The component instance if found; otherwise undefined.
   */
  getComponent<T extends Component>(type: string): T | undefined {
    return this.components.get(type) as T;
  }

  /**
   * Checks if a component of the specified type is attached.
   * @param type - The type identifier of the component.
   * @returns True if the component exists on this entity; otherwise false.
   */
  hasComponent(type: string): boolean {
    return this.components.has(type);
  }

  /**
   * Removes and detaches a component by its type identifier.
   * Invokes the component's onDetach hook if present.
   * @param type - The type identifier of the component to remove.
   * @returns True if the component was removed; false if not found.
   */
  removeComponent(type: string): boolean {
    const component = this.components.get(type);
    if (component) {
      if (component.onDetach) {
        component.onDetach();
      }

      component.entity = undefined;
      return this.components.delete(type);
    }
    return false;
  }

  /**
   * Attaches this entity to a bus, moving any subscription it already holds
   * over to it. Called by {@link World.addEntity}; passing undefined detaches.
   * @param messageBus - The bus to publish and subscribe on.
   */
  setMessageBus(messageBus?: MessageBus): void {
    if (messageBus === this.messageBus) return;

    this.disposeSubscriptions();
    this.messageBus = messageBus;

    if (messageBus) {
      this.messageDisposers = this.subscriptions.map(({ messageType, handler }) =>
        messageBus.on(messageType, handler)
      );
    }
  }

  /**
   * Returns the bus this entity is attached to, if any.
   */
  getMessageBus(): MessageBus | undefined {
    return this.messageBus;
  }

  /**
   * Emits a message on the bus this entity is attached to. A detached entity
   * has nobody to talk to, so the call is a no-op.
   * @param messageType - Identifier for the message type.
   * @param data - Optional payload to include with the message.
   */
  emit(messageType: string, data: MessageData = {}): void {
    this.messageBus?.emit(messageType, {
      entity: this,
      entityId: this.id,
      entityName: this.name,
      ...data,
    });
  }

  /**
   * Subscribes to a message type for this entity. Subscribing before the
   * entity joins a world is allowed: the handler is registered as soon as a
   * bus is attached.
   * @param messageType - Identifier for the message type to listen for.
   * @param handler - Callback invoked when the message is received.
   * @returns This entity, for method chaining.
   */
  on(messageType: string, handler: MessageHandler): Entity {
    this.subscriptions.push({ messageType, handler });

    if (this.messageBus) {
      this.messageDisposers.push(this.messageBus.on(messageType, handler));
    }

    return this;
  }

  /**
   * Clears all message subscriptions for this entity.
   */
  clearAllListeners(): void {
    this.disposeSubscriptions();
    this.subscriptions = [];
  }

  /**
   * Destroys this entity by removing all components, clearing listeners, and
   * detaching from its bus.
   */
  destroy(): void {
    Array.from(this.components.keys()).forEach((type) => {
      this.removeComponent(type);
    });

    this.clearAllListeners();
    this.messageBus = undefined;
  }

  private disposeSubscriptions(): void {
    this.messageDisposers.forEach((disposer) => disposer());
    this.messageDisposers = [];
  }
}
