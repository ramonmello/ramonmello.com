import { Entity } from "./Entity";

/**
 * Abstract base class for ECS components.
 * Components encapsulate data and optional lifecycle hooks for entity behavior.
 */
export abstract class Component {
  /**
   * The entity instance this component is attached to.
   */
  entity?: Entity;

  /**
   * Unique identifier string for the component type.
   * @returns The component type name.
   */
  abstract get type(): string;

  /**
   * Creates a new Component instance.
   */
  constructor() {}

  /**
   * Optional lifecycle hook invoked when this component is attached to an entity.
   */
  onAttach?(): void;

  /**
   * Optional lifecycle hook invoked when this component is detached from its entity.
   */
  onDetach?(): void;
}
