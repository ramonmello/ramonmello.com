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
   * Emits a message from this entity through the global MessageBus.
   * @param messageType - Identifier for the message type.
   * @param data - Optional payload to include with the message.
   */
  emit(messageType: string, data: MessageData = {}): void {
    MessageBus.getInstance().emit(messageType, {
      entity: this,
      entityId: this.id,
      entityName: this.name,
      ...data,
    });
  }

  /**
   * Subscribes to a message type for this entity and stores the disposer.
   * @param messageType - Identifier for the message type to listen for.
   * @param handler - Callback invoked when the message is received.
   * @returns This entity, for method chaining.
   */
  on(messageType: string, handler: MessageHandler): Entity {
    const disposer = MessageBus.getInstance().on(messageType, handler);
    this.messageDisposers.push(disposer);
    return this;
  }

  /**
   * Clears all message subscriptions for this entity.
   */
  clearAllListeners(): void {
    this.messageDisposers.forEach((disposer) => disposer());
    this.messageDisposers = [];
  }

  /**
   * Destroys this entity by removing all components and clearing listeners.
   */
  destroy(): void {
    Array.from(this.components.keys()).forEach((type) => {
      this.removeComponent(type);
    });

    this.clearAllListeners();
  }
}
