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

  /**
   * Optional hook invoked at the top of every simulation step, before any
   * system runs. Components that keep per-step history — a transform saving
   * the pose the renderer interpolates from — refresh it here.
   */
  beginStep?(): void;
}
