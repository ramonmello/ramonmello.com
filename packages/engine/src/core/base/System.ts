import { Entity } from "./Entity";
import { World } from "./World";

/**
 * Half of the loop a system belongs to.
 *
 * `simulation` systems run on the fixed step and always see the same delta;
 * `render` systems run once per animation frame, however many steps that frame
 * happened to advance.
 */
export type SystemPhase = "simulation" | "render";

/**
 * Abstract base class for ECS systems.
 * Systems define logic operating on entities with specific components.
 */
export abstract class System {
  /**
   * Array of component type identifiers required by this system.
   */
  abstract readonly componentTypes: string[];

  /**
   * Phase this system runs in. Simulation is the default; only systems that
   * draw belong in the render phase.
   */
  readonly phase: SystemPhase = "simulation";

  /**
   * Reference to the world instance this system is registered with.
   */
  protected world?: World;

  /**
   * Execution order priority. Lower values are processed earlier.
   */
  priority: number = 0;

  /**
   * Flag indicating whether this system is active and should run.
   */
  enabled: boolean = true;

  /**
   * Assigns the world context to this system.
   * @param world - The world instance to associate with this system.
   */
  setWorld(world: World): void {
    this.world = world;
  }

  /**
   * Determines if the provided entity should be processed by this system.
   * Checks that the entity has all required components.
   * @param entity - The entity to evaluate.
   * @returns True if the entity contains all required components; otherwise false.
   */
  shouldProcessEntity(entity: Entity): boolean {
    return this.componentTypes.every((type) => entity.hasComponent(type));
  }

  /**
   * Optional initialization hook invoked when the system is added to the world.
   * @param world - The world instance the system is initialized in.
   */
  init?(world: World): void;

  /**
   * Executes system logic for the provided entities.
   * @param entities - Array of entities matching component requirements.
   * @param deltaTime - Seconds elapsed since the previous step. Render-phase
   * systems get the interpolation factor in `[0, 1)` instead: how far past the
   * last simulated step the frame being drawn sits.
   */
  abstract update(entities: Entity[], deltaTime: number): void;
}
