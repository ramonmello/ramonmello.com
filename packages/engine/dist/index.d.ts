type MessageData = Record<string, unknown>;
type MessageHandler = (data: MessageData) => void;
declare class MessageBus {
    private static instance;
    private listeners;
    static getInstance(): MessageBus;
    private constructor();
    on(messageType: string, handler: MessageHandler): () => void;
    emit(messageType: string, data?: MessageData): void;
    clearListeners(messageType: string): void;
    clearAllListeners(): void;
    hasListeners(messageType: string): boolean;
}

/**
 * Represents an entity in the ECS.
 * Entities serve as containers for components and handle messaging.
 */
declare class Entity {
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
    private messageDisposers;
    /**
     * Creates a new Entity instance.
     * @param id - Optional unique identifier; uses a generated UUID if omitted.
     * @param name - Optional name for the entity.
     */
    constructor(id?: string, name?: string);
    /**
     * Attaches a component to this entity and invokes its onAttach hook.
     * @param component - The component instance to add.
     * @returns This entity, for method chaining.
     */
    addComponent(component: Component): Entity;
    /**
     * Retrieves a component by its type identifier.
     * @typeParam T - Expected component subclass.
     * @param type - The type identifier of the component.
     * @returns The component instance if found; otherwise undefined.
     */
    getComponent<T extends Component>(type: string): T | undefined;
    /**
     * Checks if a component of the specified type is attached.
     * @param type - The type identifier of the component.
     * @returns True if the component exists on this entity; otherwise false.
     */
    hasComponent(type: string): boolean;
    /**
     * Removes and detaches a component by its type identifier.
     * Invokes the component's onDetach hook if present.
     * @param type - The type identifier of the component to remove.
     * @returns True if the component was removed; false if not found.
     */
    removeComponent(type: string): boolean;
    /**
     * Emits a message from this entity through the global MessageBus.
     * @param messageType - Identifier for the message type.
     * @param data - Optional payload to include with the message.
     */
    emit(messageType: string, data?: MessageData): void;
    /**
     * Subscribes to a message type for this entity and stores the disposer.
     * @param messageType - Identifier for the message type to listen for.
     * @param handler - Callback invoked when the message is received.
     * @returns This entity, for method chaining.
     */
    on(messageType: string, handler: MessageHandler): Entity;
    /**
     * Clears all message subscriptions for this entity.
     */
    clearAllListeners(): void;
    /**
     * Destroys this entity by removing all components and clearing listeners.
     */
    destroy(): void;
}

/**
 * Abstract base class for ECS components.
 * Components encapsulate data and optional lifecycle hooks for entity behavior.
 */
declare abstract class Component {
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
    constructor();
    /**
     * Optional lifecycle hook invoked when this component is attached to an entity.
     */
    onAttach?(): void;
    /**
     * Optional lifecycle hook invoked when this component is detached from its entity.
     */
    onDetach?(): void;
}

/**
 * Orchestrates entities, systems, and global messaging for the application.
 */
declare class World {
    /**
     * Map of all entities keyed by their unique IDs.
     * @private
     */
    private entities;
    /**
     * Array of registered systems to execute logic on entities.
     * @private
     */
    private systems;
    /**
     * Tracks the total elapsed time since the world started (in seconds).
     * @private
     */
    private elapsedTime;
    /**
     * Stores disposal callbacks for message subscriptions.
     * @private
     */
    private messageDisposers;
    /**
     * Indicates whether the world update loop is currently active.
     * @private
     */
    private running;
    /**
     * Adds an entity to the world and emits an 'entityAdded' event.
     * @param entity - The entity instance to add.
     * @returns The world instance for method chaining.
     */
    addEntity(entity: Entity): World;
    /**
     * Removes and destroys an entity by its ID, then emits an 'entityRemoved' event.
     * @param id - The unique identifier of the entity to remove.
     */
    removeEntity(id: string): void;
    /**
     * Retrieves an entity by its unique ID.
     * @param id - The unique identifier of the entity.
     * @returns The entity instance if found; otherwise undefined.
     */
    getEntity(id: string): Entity | undefined;
    /**
     * Returns all entities currently managed by the world.
     * @returns An array of all entity instances.
     */
    getAllEntities(): Entity[];
    /**
     * Registers a system, sorts systems by priority, and invokes its init hook.
     * @param system - The system instance to add.
     * @returns The world instance for method chaining.
     */
    addSystem(system: System): World;
    /**
     * Emits a global message via the MessageBus with world context.
     * @param messageType - Identifier for the message type.
     * @param data - Optional payload to include with the message.
     */
    emit(messageType: string, data?: MessageData): void;
    /**
     * Subscribes to a global message and stores its disposer for later cleanup.
     * @param messageType - Identifier for the message type to listen for.
     * @param handler - Callback invoked when the message is received.
     * @returns The world instance for method chaining.
     */
    on(messageType: string, handler: MessageHandler): World;
    /**
     * Clears all stored message subscription disposers.
     */
    clearAllListeners(): void;
    /**
     * Starts the world update loop if not already running and emits 'worldStarted'.
     */
    start(): void;
    /**
     * Stops the world update loop if running and emits 'worldStopped'.
     */
    stop(): void;
    /**
     * Executes a single update cycle: increments elapsed time, emits hooks, and processes each enabled system.
     * @param deltaTime - Time elapsed since the last update (in seconds).
     */
    update(deltaTime: number): void;
    /**
     * Retrieves entities that have all specified component types.
     * @param componentTypes - List of component type identifiers to filter by.
     * @returns An array of matching entity instances.
     */
    getEntitiesWith(...componentTypes: string[]): Entity[];
    /**
     * Returns the total elapsed time since the world started.
     * @returns Elapsed time in milliseconds.
     */
    getElapsedTime(): number;
    /**
     * Clears all entities, systems, listeners, resets elapsed time, and emits 'worldCleared'.
     */
    clear(): void;
    /**
     * Stops and clears the world, emits 'worldDestroyed', and clears all global listeners.
     */
    destroy(): void;
}

/**
 * Abstract base class for ECS systems.
 * Systems define logic operating on entities with specific components.
 */
declare abstract class System {
    /**
     * Array of component type identifiers required by this system.
     */
    abstract readonly componentTypes: string[];
    /**
     * Reference to the world instance this system is registered with.
     */
    protected world?: World;
    /**
     * Execution order priority. Lower values are processed earlier.
     */
    priority: number;
    /**
     * Flag indicating whether this system is active and should run.
     */
    enabled: boolean;
    /**
     * Assigns the world context to this system.
     * @param world - The world instance to associate with this system.
     */
    setWorld(world: World): void;
    /**
     * Determines if the provided entity should be processed by this system.
     * Checks that the entity has all required components.
     * @param entity - The entity to evaluate.
     * @returns True if the entity contains all required components; otherwise false.
     */
    shouldProcessEntity(entity: Entity): boolean;
    /**
     * Optional initialization hook invoked when the system is added to the world.
     * @param world - The world instance the system is initialized in.
     */
    init?(world: World): void;
    /**
     * Executes system logic for the provided entities.
     * @param entities - Array of entities matching component requirements.
     * @param deltaTime - Time elapsed since the last update (in seconds).
     */
    abstract update(entities: Entity[], deltaTime: number): void;
}

interface Vector2 {
    x: number;
    y: number;
}
declare class TransformComponent extends Component {
    static readonly TYPE = "transform";
    get type(): string;
    position: Vector2;
    rotation: number;
    scale: Vector2;
    constructor(x?: number, y?: number, rotation?: number, scaleX?: number, scaleY?: number);
    setPosition(x: number, y: number): TransformComponent;
    setRotation(rotation: number): TransformComponent;
    setScale(x: number, y: number): TransformComponent;
    translate(deltaX: number, deltaY: number): TransformComponent;
    rotate(deltaRotation: number): TransformComponent;
}

declare enum ColliderType {
    Circle = 0,
    Rectangle = 1,
    Polygon = 2
}
declare class ColliderComponent extends Component {
    static readonly TYPE = "collider";
    get type(): string;
    colliderType: ColliderType;
    radius?: number;
    width?: number;
    height?: number;
    vertices?: Float32Array;
    offset: Vector2;
    tags: Set<string>;
    layer: number;
    mask: number;
    active: boolean;
    isTrigger: boolean;
    constructor(type: ColliderType);
    static createCircle(radius: number): ColliderComponent;
    static createRectangle(width: number, height: number): ColliderComponent;
    static createPolygon(vertices: Float32Array): ColliderComponent;
    setOffset(x: number, y: number): ColliderComponent;
    addTag(tag: string): ColliderComponent;
    removeTag(tag: string): ColliderComponent;
    hasTag(tag: string): boolean;
    setLayer(layer: number): ColliderComponent;
    setMask(mask: number): ColliderComponent;
    setActive(active: boolean): ColliderComponent;
    setTrigger(isTrigger: boolean): ColliderComponent;
    canCollideWith(other: ColliderComponent): boolean;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
}
interface EmitterConfig {
    num: number;
    speed: [number, number];
    size: [number, number];
    duration: number;
}

declare class ParticleEmitterComponent extends Component {
    static readonly TYPE = "particleEmitter";
    get type(): string;
    particles: Particle[];
    elapsed: number;
    readonly maxLifetime: number;
    constructor(config: EmitterConfig);
}

declare class PhysicsComponent extends Component {
    static readonly TYPE = "physics";
    get type(): string;
    velocity: Vector2;
    acceleration: Vector2;
    angularVelocity: number;
    friction: number;
    wrapAroundEdges: boolean;
    mass: number;
    maxSpeed?: number;
    constructor(friction?: number, wrapAroundEdges?: boolean, mass?: number, maxSpeed?: number);
    setVelocity(x: number, y: number): PhysicsComponent;
    setAcceleration(x: number, y: number): PhysicsComponent;
    setAngularVelocity(angularVelocity: number): PhysicsComponent;
    setFriction(friction: number): PhysicsComponent;
    setWrapAroundEdges(wrap: boolean): PhysicsComponent;
    setMass(mass: number): PhysicsComponent;
    setMaxSpeed(maxSpeed?: number): PhysicsComponent;
    applyForce(forceX: number, forceY: number): PhysicsComponent;
    applyImpulse(impulseX: number, impulseY: number): PhysicsComponent;
    private applySpeedLimit;
}

interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}
declare class RenderComponent extends Component {
    static readonly TYPE = "render";
    get type(): string;
    vertices: Float32Array;
    color: Color;
    visible: boolean;
    zIndex: number;
    drawMode: "triangles" | "lines" | "line_loop" | "points";
    constructor(vertices: Float32Array, color?: Partial<Color>);
    setColor(r: number, g: number, b: number, a?: number): RenderComponent;
    setVisible(visible: boolean): RenderComponent;
    setZIndex(zIndex: number): RenderComponent;
    setDrawMode(mode: "triangles" | "lines" | "line_loop" | "points"): RenderComponent;
    setVertices(vertices: Float32Array): RenderComponent;
    static createRectangle(width: number, height: number): RenderComponent;
    static createTriangle(size: number): RenderComponent;
    static createCircle(radius: number, segments?: number): RenderComponent;
}

declare class WebGLContext {
    gl: WebGLRenderingContext;
    canvas: HTMLCanvasElement;
    positionBuffer: WebGLBuffer;
    locs: {
        program: WebGLProgram;
        a_position: number;
        u_resolution: WebGLUniformLocation;
        u_translation: WebGLUniformLocation;
        u_rotation: WebGLUniformLocation;
        u_color: WebGLUniformLocation;
    };
    constructor(canvasElement: HTMLCanvasElement);
    resizeCanvas(): void;
    initShaders(vertexSource: string, fragmentSource: string): void;
}
declare function initWebGLContext(canvasEl: HTMLCanvasElement): Promise<WebGLContext>;
declare function getWebGLContext(): WebGLContext;
declare function clearWebGLContext(): void;

declare class CollisionSystem extends System {
    readonly componentTypes: string[];
    priority: number;
    update(entities: Entity[]): void;
    private checkCollision;
    private circleCircleCollision;
    private rectRectCollision;
    private circleRectCollision;
}

declare class EmitterRenderSystem extends System {
    readonly componentTypes: string[];
    priority: number;
    private static readonly QUAD;
    update(entities: Entity[]): void;
}

declare class ParticleSystem extends System {
    readonly componentTypes: string[];
    priority: number;
    update(entities: Entity[], dt: number): void;
}

declare class PhysicsSystem extends System {
    readonly componentTypes: string[];
    priority: number;
    update(entities: Entity[], deltaTime: number): void;
}

declare class RenderSystem extends System {
    readonly componentTypes: string[];
    priority: number;
    private clearScreen;
    private backgroundColor;
    constructor(clearScreen?: boolean, backgroundColor?: [number, number, number, number]);
    update(entities: Entity[]): void;
    setClearScreen(clear: boolean): void;
    setBackgroundColor(r: number, g: number, b: number, a?: number): void;
}

declare const WORLD_EVENTS: {
    STARTED: string;
    STOPPED: string;
    CLEARED: string;
    DESTROYED: string;
    PRE_UPDATE: string;
    POST_UPDATE: string;
    ENTITY_ADDED: string;
    ENTITY_REMOVED: string;
};
declare const PLAYER_EVENTS: {
    MOVE: string;
    FIRE: string;
    BOOST: string;
    HIT: string;
    DIE: string;
    RESPAWN: string;
};
declare const COLLISION_EVENTS: {
    DETECT: string;
    RESOLVE: string;
    ENTER: string;
    STAY: string;
    EXIT: string;
};
declare const GAME_EVENTS: {
    SCORE_CHANGED: string;
    LEVEL_CHANGED: string;
    GAME_OVER: string;
    GAME_WIN: string;
    GAME_PAUSE: string;
    GAME_RESUME: string;
    INITIALIZED: string;
    STARTED: string;
    PAUSED: string;
    RESUMED: string;
    STOPPED: string;
    RESTARTED: string;
};
declare const PROJECTILE_EVENTS: {
    FIRE: string;
    HIT: string;
    EXPIRE: string;
};
declare const ENTITY_EVENTS: {
    CREATED: string;
    DESTROYED: string;
    UPDATED: string;
    COMPONENT_ADDED: string;
    COMPONENT_REMOVED: string;
    STATE_CHANGED: string;
};
declare const MESSAGE_TYPES: {
    ECS: {
        ENTITY_CREATED: string;
        ENTITY_DESTROYED: string;
        COMPONENT_ADDED: string;
        COMPONENT_REMOVED: string;
    };
    INPUT: {
        KEY_DOWN: string;
        KEY_UP: string;
        MOUSE_DOWN: string;
        MOUSE_UP: string;
        MOUSE_MOVE: string;
    };
    GAME: {
        INIT: string;
        START: string;
        PAUSE: string;
        RESUME: string;
        END: string;
    };
};

declare const TARGET_FPS = 60;
declare const FRAME_TIME: number;

interface InputSystem {
    getDirection(): {
        x: number;
        y: number;
    };
    getActions(): {
        [key: string]: boolean;
    };
    update(): void;
}

type KeyState = {
    [key: string]: boolean;
};
interface KeyboardHandler {
    getState(): KeyState;
}
declare class KeyboardInputSystem implements InputSystem {
    private keyboard;
    constructor(keyboard: KeyboardHandler);
    getDirection(): {
        x: number;
        y: number;
    };
    getActions(): {
        [key: string]: boolean;
    };
    update(): void;
}

interface GameConfig {
    canvasWidth: number;
    canvasHeight: number;
    debug?: boolean;
    [key: string]: unknown;
}
interface Game {
    name: string;
    description: string;
    initialize(world?: World, config?: Partial<GameConfig>): Promise<void>;
    start(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    restart(): Promise<void>;
    setInputSystem(inputSystem: InputSystem): void;
    getWorld(): World;
    getConfig(): GameConfig;
}

declare abstract class BaseGame implements Game {
    abstract name: string;
    abstract description: string;
    protected world: World;
    protected config: GameConfig;
    protected initialized: boolean;
    protected running: boolean;
    protected inputSystem?: InputSystem;
    constructor();
    protected abstract getDefaultConfig(): GameConfig;
    protected abstract createSystems(): void;
    protected abstract createEntities(): void;
    setInputSystem(inputSystem: InputSystem): void;
    getInputSystem(): InputSystem | undefined;
    initialize(world?: World, config?: Partial<GameConfig>): Promise<void>;
    start(): void;
    pause(): void;
    resume(): void;
    stop(): void;
    restart(): Promise<void>;
    getWorld(): World;
    getConfig(): GameConfig;
    isRunning(): boolean;
    isInitialized(): boolean;
}

declare class Manager {
    private static instance;
    private activeGame?;
    private inputSystem?;
    private animFrameId?;
    private lastTime;
    private isRunning;
    static getInstance(): Manager;
    private constructor();
    rebindCanvas(canvas: HTMLCanvasElement): Promise<void>;
    startGame(game: Game, canvas: HTMLCanvasElement, config?: Partial<GameConfig>): Promise<() => void>;
    setInputHandler(keyboard: KeyboardHandler): void;
    private startGameLoop;
    private stopGameLoop;
    stopGame(): void;
    pauseGame(): void;
    resumeGame(): void;
    getActiveGame(): Game | undefined;
    hasActiveGame(): boolean;
}

export { BaseGame, COLLISION_EVENTS, ColliderComponent, ColliderType, CollisionSystem, type Color, Component, ENTITY_EVENTS, type EmitterConfig, EmitterRenderSystem, Entity, FRAME_TIME, GAME_EVENTS, type Game, type GameConfig, type KeyState, type KeyboardHandler, KeyboardInputSystem, MESSAGE_TYPES, Manager, MessageBus, type MessageData, type MessageHandler, PLAYER_EVENTS, PROJECTILE_EVENTS, type Particle, ParticleEmitterComponent, ParticleSystem, PhysicsComponent, PhysicsSystem, RenderComponent, RenderSystem, System, TARGET_FPS, TransformComponent, type Vector2, WORLD_EVENTS, WebGLContext, World, clearWebGLContext, getWebGLContext, initWebGLContext };
