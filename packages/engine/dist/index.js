"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BaseGame: () => BaseGame,
  COLLISION_EVENTS: () => COLLISION_EVENTS,
  ColliderComponent: () => ColliderComponent,
  ColliderType: () => ColliderType,
  CollisionSystem: () => CollisionSystem,
  Component: () => Component,
  ENTITY_EVENTS: () => ENTITY_EVENTS,
  EmitterRenderSystem: () => EmitterRenderSystem,
  Entity: () => Entity,
  FRAME_TIME: () => FRAME_TIME,
  GAME_EVENTS: () => GAME_EVENTS,
  KeyboardInputSystem: () => KeyboardInputSystem,
  MESSAGE_TYPES: () => MESSAGE_TYPES,
  Manager: () => Manager,
  MessageBus: () => MessageBus,
  PLAYER_EVENTS: () => PLAYER_EVENTS,
  PROJECTILE_EVENTS: () => PROJECTILE_EVENTS,
  ParticleEmitterComponent: () => ParticleEmitterComponent,
  ParticleSystem: () => ParticleSystem,
  PhysicsComponent: () => PhysicsComponent,
  PhysicsSystem: () => PhysicsSystem,
  RenderComponent: () => RenderComponent,
  RenderSystem: () => RenderSystem,
  System: () => System,
  TARGET_FPS: () => TARGET_FPS,
  TransformComponent: () => TransformComponent,
  WORLD_EVENTS: () => WORLD_EVENTS,
  WebGLContext: () => WebGLContext,
  World: () => World,
  clearWebGLContext: () => clearWebGLContext,
  getWebGLContext: () => getWebGLContext,
  initWebGLContext: () => initWebGLContext
});
module.exports = __toCommonJS(index_exports);

// src/core/base/Component.ts
var Component = class {
  /**
   * Creates a new Component instance.
   */
  constructor() {
  }
};

// src/core/messaging/MessageBus.ts
var MessageBus = class _MessageBus {
  constructor() {
    this.listeners = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    if (!_MessageBus.instance) {
      _MessageBus.instance = new _MessageBus();
    }
    return _MessageBus.instance;
  }
  on(messageType, handler) {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, /* @__PURE__ */ new Set());
    }
    this.listeners.get(messageType).add(handler);
    return () => {
      const handlers = this.listeners.get(messageType);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.listeners.delete(messageType);
        }
      }
    };
  }
  emit(messageType, data = {}) {
    const handlers = this.listeners.get(messageType);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
  clearListeners(messageType) {
    this.listeners.delete(messageType);
  }
  clearAllListeners() {
    this.listeners.clear();
  }
  hasListeners(messageType) {
    return this.listeners.has(messageType) && this.listeners.get(messageType).size > 0;
  }
};

// src/core/base/Entity.ts
var Entity = class {
  /**
   * Creates a new Entity instance.
   * @param id - Optional unique identifier; uses a generated UUID if omitted.
   * @param name - Optional name for the entity.
   */
  constructor(id, name) {
    /**
     * Internal disposers for message subscriptions to allow cleanup.
     */
    this.messageDisposers = [];
    this.id = id || crypto.randomUUID();
    this.components = /* @__PURE__ */ new Map();
    this.name = name;
  }
  /**
   * Attaches a component to this entity and invokes its onAttach hook.
   * @param component - The component instance to add.
   * @returns This entity, for method chaining.
   */
  addComponent(component) {
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
  getComponent(type) {
    return this.components.get(type);
  }
  /**
   * Checks if a component of the specified type is attached.
   * @param type - The type identifier of the component.
   * @returns True if the component exists on this entity; otherwise false.
   */
  hasComponent(type) {
    return this.components.has(type);
  }
  /**
   * Removes and detaches a component by its type identifier.
   * Invokes the component's onDetach hook if present.
   * @param type - The type identifier of the component to remove.
   * @returns True if the component was removed; false if not found.
   */
  removeComponent(type) {
    const component = this.components.get(type);
    if (component) {
      if (component.onDetach) {
        component.onDetach();
      }
      component.entity = void 0;
      return this.components.delete(type);
    }
    return false;
  }
  /**
   * Emits a message from this entity through the global MessageBus.
   * @param messageType - Identifier for the message type.
   * @param data - Optional payload to include with the message.
   */
  emit(messageType, data = {}) {
    MessageBus.getInstance().emit(messageType, {
      entity: this,
      entityId: this.id,
      entityName: this.name,
      ...data
    });
  }
  /**
   * Subscribes to a message type for this entity and stores the disposer.
   * @param messageType - Identifier for the message type to listen for.
   * @param handler - Callback invoked when the message is received.
   * @returns This entity, for method chaining.
   */
  on(messageType, handler) {
    const disposer = MessageBus.getInstance().on(messageType, handler);
    this.messageDisposers.push(disposer);
    return this;
  }
  /**
   * Clears all message subscriptions for this entity.
   */
  clearAllListeners() {
    this.messageDisposers.forEach((disposer) => disposer());
    this.messageDisposers = [];
  }
  /**
   * Destroys this entity by removing all components and clearing listeners.
   */
  destroy() {
    Array.from(this.components.keys()).forEach((type) => {
      this.removeComponent(type);
    });
    this.clearAllListeners();
  }
};

// src/core/base/System.ts
var System = class {
  constructor() {
    /**
     * Execution order priority. Lower values are processed earlier.
     */
    this.priority = 0;
    /**
     * Flag indicating whether this system is active and should run.
     */
    this.enabled = true;
  }
  /**
   * Assigns the world context to this system.
   * @param world - The world instance to associate with this system.
   */
  setWorld(world) {
    this.world = world;
  }
  /**
   * Determines if the provided entity should be processed by this system.
   * Checks that the entity has all required components.
   * @param entity - The entity to evaluate.
   * @returns True if the entity contains all required components; otherwise false.
   */
  shouldProcessEntity(entity) {
    return this.componentTypes.every((type) => entity.hasComponent(type));
  }
};

// src/core/base/World.ts
var World = class {
  constructor() {
    /**
     * Map of all entities keyed by their unique IDs.
     * @private
     */
    this.entities = /* @__PURE__ */ new Map();
    /**
     * Array of registered systems to execute logic on entities.
     * @private
     */
    this.systems = [];
    /**
     * Tracks the total elapsed time since the world started (in seconds).
     * @private
     */
    this.elapsedTime = 0;
    /**
     * Stores disposal callbacks for message subscriptions.
     * @private
     */
    this.messageDisposers = [];
    /**
     * Indicates whether the world update loop is currently active.
     * @private
     */
    this.running = false;
  }
  /**
   * Adds an entity to the world and emits an 'entityAdded' event.
   * @param entity - The entity instance to add.
   * @returns The world instance for method chaining.
   */
  addEntity(entity) {
    this.entities.set(entity.id, entity);
    this.emit("entityAdded", { entity });
    return this;
  }
  /**
   * Removes and destroys an entity by its ID, then emits an 'entityRemoved' event.
   * @param id - The unique identifier of the entity to remove.
   */
  removeEntity(id) {
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
  getEntity(id) {
    return this.entities.get(id);
  }
  /**
   * Returns all entities currently managed by the world.
   * @returns An array of all entity instances.
   */
  getAllEntities() {
    return Array.from(this.entities.values());
  }
  /**
   * Registers a system, sorts systems by priority, and invokes its init hook.
   * @param system - The system instance to add.
   * @returns The world instance for method chaining.
   */
  addSystem(system) {
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
  emit(messageType, data = {}) {
    MessageBus.getInstance().emit(messageType, {
      world: this,
      ...data
    });
  }
  /**
   * Subscribes to a global message and stores its disposer for later cleanup.
   * @param messageType - Identifier for the message type to listen for.
   * @param handler - Callback invoked when the message is received.
   * @returns The world instance for method chaining.
   */
  on(messageType, handler) {
    const disposer = MessageBus.getInstance().on(messageType, handler);
    this.messageDisposers.push(disposer);
    return this;
  }
  /**
   * Clears all stored message subscription disposers.
   */
  clearAllListeners() {
    this.messageDisposers.forEach((disposer) => disposer());
    this.messageDisposers = [];
  }
  /**
   * Starts the world update loop if not already running and emits 'worldStarted'.
   */
  start() {
    if (!this.running) {
      this.running = true;
      this.emit("worldStarted", {});
    }
  }
  /**
   * Stops the world update loop if running and emits 'worldStopped'.
   */
  stop() {
    if (this.running) {
      this.running = false;
      this.emit("worldStopped", {});
    }
  }
  /**
   * Executes a single update cycle: increments elapsed time, emits hooks, and processes each enabled system.
   * @param deltaTime - Time elapsed since the last update (in seconds).
   */
  update(deltaTime) {
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
  getEntitiesWith(...componentTypes) {
    return Array.from(this.entities.values()).filter(
      (entity) => componentTypes.every((type) => entity.hasComponent(type))
    );
  }
  /**
   * Returns the total elapsed time since the world started.
   * @returns Elapsed time in milliseconds.
   */
  getElapsedTime() {
    return this.elapsedTime;
  }
  /**
   * Clears all entities, systems, listeners, resets elapsed time, and emits 'worldCleared'.
   */
  clear() {
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
  destroy() {
    this.stop();
    this.clear();
    this.emit("worldDestroyed", {});
    MessageBus.getInstance().clearAllListeners();
  }
};

// src/core/components/TransformComponent.ts
var _TransformComponent = class _TransformComponent extends Component {
  get type() {
    return _TransformComponent.TYPE;
  }
  constructor(x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) {
    super();
    this.position = { x, y };
    this.rotation = rotation;
    this.scale = { x: scaleX, y: scaleY };
  }
  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
    return this;
  }
  setRotation(rotation) {
    this.rotation = rotation;
    return this;
  }
  setScale(x, y) {
    this.scale.x = x;
    this.scale.y = y;
    return this;
  }
  translate(deltaX, deltaY) {
    this.position.x += deltaX;
    this.position.y += deltaY;
    return this;
  }
  rotate(deltaRotation) {
    this.rotation += deltaRotation;
    return this;
  }
};
_TransformComponent.TYPE = "transform";
var TransformComponent = _TransformComponent;

// src/core/components/ColliderComponent.ts
var ColliderType = /* @__PURE__ */ ((ColliderType2) => {
  ColliderType2[ColliderType2["Circle"] = 0] = "Circle";
  ColliderType2[ColliderType2["Rectangle"] = 1] = "Rectangle";
  ColliderType2[ColliderType2["Polygon"] = 2] = "Polygon";
  return ColliderType2;
})(ColliderType || {});
var _ColliderComponent = class _ColliderComponent extends Component {
  get type() {
    return _ColliderComponent.TYPE;
  }
  constructor(type) {
    super();
    this.colliderType = type;
    this.offset = { x: 0, y: 0 };
    this.tags = /* @__PURE__ */ new Set();
    this.layer = 1;
    this.mask = 4294967295;
    this.active = true;
    this.isTrigger = false;
  }
  static createCircle(radius) {
    const collider = new _ColliderComponent(0 /* Circle */);
    collider.radius = radius;
    return collider;
  }
  static createRectangle(width, height) {
    const collider = new _ColliderComponent(1 /* Rectangle */);
    collider.width = width;
    collider.height = height;
    return collider;
  }
  static createPolygon(vertices) {
    const collider = new _ColliderComponent(2 /* Polygon */);
    collider.vertices = vertices;
    return collider;
  }
  setOffset(x, y) {
    this.offset.x = x;
    this.offset.y = y;
    return this;
  }
  addTag(tag) {
    this.tags.add(tag);
    return this;
  }
  removeTag(tag) {
    this.tags.delete(tag);
    return this;
  }
  hasTag(tag) {
    return this.tags.has(tag);
  }
  setLayer(layer) {
    this.layer = layer;
    return this;
  }
  setMask(mask) {
    this.mask = mask;
    return this;
  }
  setActive(active) {
    this.active = active;
    return this;
  }
  setTrigger(isTrigger) {
    this.isTrigger = isTrigger;
    return this;
  }
  canCollideWith(other) {
    if (!this.active || !other.active) return false;
    if ((this.layer & other.mask) === 0 || (other.layer & this.mask) === 0) {
      return false;
    }
    return true;
  }
};
_ColliderComponent.TYPE = "collider";
var ColliderComponent = _ColliderComponent;

// src/core/components/ParticleEmitterComponent.ts
var _ParticleEmitterComponent = class _ParticleEmitterComponent extends Component {
  constructor(config) {
    super();
    this.particles = [];
    this.elapsed = 0;
    this.maxLifetime = config.duration;
    for (let i = 0; i < config.num; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);
      const size = config.size[0] + Math.random() * (config.size[1] - config.size[0]);
      this.particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life: 0,
        maxLife: this.maxLifetime
      });
    }
  }
  get type() {
    return _ParticleEmitterComponent.TYPE;
  }
};
_ParticleEmitterComponent.TYPE = "particleEmitter";
var ParticleEmitterComponent = _ParticleEmitterComponent;

// src/core/components/PhysicsComponent.ts
var _PhysicsComponent = class _PhysicsComponent extends Component {
  get type() {
    return _PhysicsComponent.TYPE;
  }
  constructor(friction = 0.99, wrapAroundEdges = true, mass = 1, maxSpeed) {
    super();
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.angularVelocity = 0;
    this.friction = friction;
    this.wrapAroundEdges = wrapAroundEdges;
    this.mass = mass;
    this.maxSpeed = maxSpeed;
  }
  setVelocity(x, y) {
    this.velocity.x = x;
    this.velocity.y = y;
    this.applySpeedLimit();
    return this;
  }
  setAcceleration(x, y) {
    this.acceleration.x = x;
    this.acceleration.y = y;
    return this;
  }
  setAngularVelocity(angularVelocity) {
    this.angularVelocity = angularVelocity;
    return this;
  }
  setFriction(friction) {
    this.friction = friction;
    return this;
  }
  setWrapAroundEdges(wrap) {
    this.wrapAroundEdges = wrap;
    return this;
  }
  setMass(mass) {
    this.mass = mass;
    return this;
  }
  setMaxSpeed(maxSpeed) {
    this.maxSpeed = maxSpeed;
    this.applySpeedLimit();
    return this;
  }
  applyForce(forceX, forceY) {
    this.acceleration.x += forceX / this.mass;
    this.acceleration.y += forceY / this.mass;
    return this;
  }
  applyImpulse(impulseX, impulseY) {
    this.velocity.x += impulseX / this.mass;
    this.velocity.y += impulseY / this.mass;
    this.applySpeedLimit();
    return this;
  }
  applySpeedLimit() {
    if (this.maxSpeed !== void 0) {
      const currentSpeed = Math.hypot(this.velocity.x, this.velocity.y);
      if (currentSpeed > this.maxSpeed) {
        const scaleFactor = this.maxSpeed / currentSpeed;
        this.velocity.x *= scaleFactor;
        this.velocity.y *= scaleFactor;
      }
    }
  }
};
_PhysicsComponent.TYPE = "physics";
var PhysicsComponent = _PhysicsComponent;

// src/core/components/RenderComponent.ts
var _RenderComponent = class _RenderComponent extends Component {
  constructor(vertices, color = { r: 1, g: 1, b: 1, a: 1 }) {
    super();
    this.visible = true;
    this.zIndex = 0;
    this.drawMode = "triangles";
    this.vertices = vertices;
    this.color = {
      r: color.r ?? 1,
      g: color.g ?? 1,
      b: color.b ?? 1,
      a: color.a ?? 1
    };
  }
  get type() {
    return _RenderComponent.TYPE;
  }
  setColor(r, g, b, a = 1) {
    this.color = { r, g, b, a };
    return this;
  }
  setVisible(visible) {
    this.visible = visible;
    return this;
  }
  setZIndex(zIndex) {
    this.zIndex = zIndex;
    return this;
  }
  setDrawMode(mode) {
    this.drawMode = mode;
    return this;
  }
  setVertices(vertices) {
    this.vertices = vertices;
    return this;
  }
  static createRectangle(width, height) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const vertices = new Float32Array([
      -halfWidth,
      -halfHeight,
      halfWidth,
      -halfHeight,
      halfWidth,
      halfHeight,
      halfWidth,
      halfHeight,
      -halfWidth,
      halfHeight,
      -halfWidth,
      -halfHeight
    ]);
    return new _RenderComponent(vertices);
  }
  static createTriangle(size) {
    const halfSize = size / 2;
    const height = Math.sqrt(3) / 2 * size;
    const vertices = new Float32Array([
      0,
      height / 2,
      -halfSize,
      -height / 2,
      halfSize,
      -height / 2
    ]);
    return new _RenderComponent(vertices);
  }
  static createCircle(radius, segments = 20) {
    const vertices = new Float32Array(segments * 3 * 2);
    for (let i = 0; i < segments; i++) {
      const angle1 = i / segments * Math.PI * 2;
      const angle2 = (i + 1) / segments * Math.PI * 2;
      vertices[i * 6] = 0;
      vertices[i * 6 + 1] = 0;
      vertices[i * 6 + 2] = Math.cos(angle1) * radius;
      vertices[i * 6 + 3] = Math.sin(angle1) * radius;
      vertices[i * 6 + 4] = Math.cos(angle2) * radius;
      vertices[i * 6 + 5] = Math.sin(angle2) * radius;
    }
    return new _RenderComponent(vertices);
  }
};
_RenderComponent.TYPE = "render";
var RenderComponent = _RenderComponent;

// src/core/rendering/Context.ts
var WebGLContext = class {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    const gl = canvasElement.getContext("webgl");
    if (!gl) throw new Error("WebGL not supported");
    this.gl = gl;
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  }
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  initShaders(vertexSource, fragmentSource) {
    const { gl } = this;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(s) || "Shader compile error");
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, vertexSource);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Program link error");
    }
    this.positionBuffer = gl.createBuffer();
    this.locs = {
      program,
      a_position: gl.getAttribLocation(program, "a_position"),
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_translation: gl.getUniformLocation(program, "u_translation"),
      u_rotation: gl.getUniformLocation(program, "u_rotation"),
      u_color: gl.getUniformLocation(program, "u_color")
    };
  }
};
var ctx = null;
async function initWebGLContext(canvasEl) {
  if (!ctx) {
    ctx = new WebGLContext(canvasEl);
    const [vs, fs] = await Promise.all([
      fetch("/shaders/vertex.glsl").then((r) => r.text()),
      fetch("/shaders/fragment.glsl").then((r) => r.text())
    ]);
    ctx.initShaders(vs, fs);
  } else {
    ctx.canvas = canvasEl;
    ctx.resizeCanvas();
  }
  return ctx;
}
function getWebGLContext() {
  if (!ctx) throw new Error("WebGLContext not initialized");
  return ctx;
}
function clearWebGLContext() {
  ctx = null;
}

// src/core/messaging/MessageTypes.ts
var WORLD_EVENTS = {
  STARTED: "worldStarted",
  STOPPED: "worldStopped",
  CLEARED: "worldCleared",
  DESTROYED: "worldDestroyed",
  PRE_UPDATE: "preUpdate",
  POST_UPDATE: "postUpdate",
  ENTITY_ADDED: "entityAdded",
  ENTITY_REMOVED: "entityRemoved"
};
var PLAYER_EVENTS = {
  MOVE: "playerMove",
  FIRE: "playerFire",
  BOOST: "playerBoost",
  HIT: "playerHit",
  DIE: "playerDie",
  RESPAWN: "playerRespawn"
};
var COLLISION_EVENTS = {
  DETECT: "collision.detect",
  RESOLVE: "collision.resolve",
  ENTER: "collision.trigger.enter",
  STAY: "collision.trigger.stay",
  EXIT: "collision.trigger.exit"
};
var GAME_EVENTS = {
  SCORE_CHANGED: "scoreChanged",
  LEVEL_CHANGED: "levelChanged",
  GAME_OVER: "gameOver",
  GAME_WIN: "gameWin",
  GAME_PAUSE: "gamePause",
  GAME_RESUME: "gameResume",
  INITIALIZED: "gameInitialized",
  STARTED: "gameStarted",
  PAUSED: "gamePaused",
  RESUMED: "gameResumed",
  STOPPED: "gameStopped",
  RESTARTED: "gameRestarted"
};
var PROJECTILE_EVENTS = {
  FIRE: "projectileFire",
  HIT: "projectileHit",
  EXPIRE: "projectileExpire"
};
var ENTITY_EVENTS = {
  CREATED: "entityCreated",
  DESTROYED: "entityDestroyed",
  UPDATED: "entityUpdated",
  COMPONENT_ADDED: "componentAdded",
  COMPONENT_REMOVED: "componentRemoved",
  STATE_CHANGED: "entityStateChanged"
};
var MESSAGE_TYPES = {
  ECS: {
    ENTITY_CREATED: "entity.created",
    ENTITY_DESTROYED: "entity.destroyed",
    COMPONENT_ADDED: "component.added",
    COMPONENT_REMOVED: "component.removed"
  },
  INPUT: {
    KEY_DOWN: "input.key.down",
    KEY_UP: "input.key.up",
    MOUSE_DOWN: "input.mouse.down",
    MOUSE_UP: "input.mouse.up",
    MOUSE_MOVE: "input.mouse.move"
  },
  GAME: {
    INIT: "game.init",
    START: "game.start",
    PAUSE: "game.pause",
    RESUME: "game.resume",
    END: "game.end"
  }
};

// src/core/systems/CollisionSystem.ts
var CollisionSystem = class extends System {
  constructor() {
    super(...arguments);
    this.componentTypes = [TransformComponent.TYPE, ColliderComponent.TYPE];
    this.priority = 50;
  }
  update(entities) {
    const activeEntities = entities.filter((entity) => {
      const collider = entity.getComponent(
        ColliderComponent.TYPE
      );
      return collider && collider.active;
    });
    for (let i = 0; i < activeEntities.length; i++) {
      const entityA = activeEntities[i];
      const colliderA = entityA.getComponent(
        ColliderComponent.TYPE
      );
      for (let j = i + 1; j < activeEntities.length; j++) {
        const entityB = activeEntities[j];
        const colliderB = entityB.getComponent(
          ColliderComponent.TYPE
        );
        if (!colliderA.canCollideWith(colliderB)) continue;
        if (this.checkCollision(entityA, entityB)) {
          this.world?.emit(COLLISION_EVENTS.DETECT, {
            entityA,
            entityB,
            colliderA,
            colliderB
          });
          if (!colliderA.isTrigger && !colliderB.isTrigger) {
            this.world?.emit(COLLISION_EVENTS.RESOLVE, {
              entityA,
              entityB,
              colliderA,
              colliderB
            });
          }
        }
      }
    }
  }
  checkCollision(entityA, entityB) {
    const transformA = entityA.getComponent(
      TransformComponent.TYPE
    );
    const colliderA = entityA.getComponent(
      ColliderComponent.TYPE
    );
    const transformB = entityB.getComponent(
      TransformComponent.TYPE
    );
    const colliderB = entityB.getComponent(
      ColliderComponent.TYPE
    );
    const posA = {
      x: transformA.position.x + colliderA.offset.x,
      y: transformA.position.y + colliderA.offset.y
    };
    const posB = {
      x: transformB.position.x + colliderB.offset.x,
      y: transformB.position.y + colliderB.offset.y
    };
    if (colliderA.colliderType === 0 /* Circle */ && colliderB.colliderType === 0 /* Circle */) {
      return this.circleCircleCollision(
        posA,
        colliderA.radius || 0,
        posB,
        colliderB.radius || 0
      );
    }
    if (colliderA.colliderType === 1 /* Rectangle */ && colliderB.colliderType === 1 /* Rectangle */) {
      return this.rectRectCollision(
        posA,
        colliderA.width || 0,
        colliderA.height || 0,
        posB,
        colliderB.width || 0,
        colliderB.height || 0
      );
    }
    if (colliderA.colliderType === 0 /* Circle */ && colliderB.colliderType === 1 /* Rectangle */) {
      return this.circleRectCollision(
        posA,
        colliderA.radius || 0,
        posB,
        colliderB.width || 0,
        colliderB.height || 0
      );
    }
    if (colliderA.colliderType === 1 /* Rectangle */ && colliderB.colliderType === 0 /* Circle */) {
      return this.circleRectCollision(
        posB,
        colliderB.radius || 0,
        posA,
        colliderA.width || 0,
        colliderA.height || 0
      );
    }
    return this.circleCircleCollision(
      posA,
      Math.max(colliderA.radius || 0, 10),
      posB,
      Math.max(colliderB.radius || 0, 10)
    );
  }
  circleCircleCollision(posA, radiusA, posB, radiusB) {
    const dx = posA.x - posB.x;
    const dy = posA.y - posB.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radiusA + radiusB;
  }
  rectRectCollision(posA, widthA, heightA, posB, widthB, heightB) {
    const halfWidthA = widthA / 2;
    const halfHeightA = heightA / 2;
    const halfWidthB = widthB / 2;
    const halfHeightB = heightB / 2;
    const leftA = posA.x - halfWidthA;
    const rightA = posA.x + halfWidthA;
    const topA = posA.y - halfHeightA;
    const bottomA = posA.y + halfHeightA;
    const leftB = posB.x - halfWidthB;
    const rightB = posB.x + halfWidthB;
    const topB = posB.y - halfHeightB;
    const bottomB = posB.y + halfHeightB;
    return !(rightA < leftB || leftA > rightB || bottomA < topB || topA > bottomB);
  }
  circleRectCollision(circlePos, radius, rectPos, width, height) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const dx = Math.abs(circlePos.x - rectPos.x);
    const dy = Math.abs(circlePos.y - rectPos.y);
    if (dx > halfWidth + radius) return false;
    if (dy > halfHeight + radius) return false;
    if (dx <= halfWidth) return true;
    if (dy <= halfHeight) return true;
    const cornerDistanceSq = Math.pow(dx - halfWidth, 2) + Math.pow(dy - halfHeight, 2);
    return cornerDistanceSq <= Math.pow(radius, 2);
  }
};

// src/core/systems/EmitterRenderSystem.ts
var _EmitterRenderSystem = class _EmitterRenderSystem extends System {
  constructor() {
    super(...arguments);
    this.componentTypes = [
      TransformComponent.TYPE,
      ParticleEmitterComponent.TYPE
    ];
    this.priority = 110;
  }
  update(entities) {
    const { gl, canvas, positionBuffer, locs } = getWebGLContext();
    entities.forEach((e) => {
      const base = e.getComponent(TransformComponent.TYPE);
      const pe = e.getComponent(
        ParticleEmitterComponent.TYPE
      );
      pe.particles.forEach((p) => {
        const alpha = 1 - p.life / p.maxLife;
        gl.useProgram(locs.program);
        gl.uniform2f(locs.u_resolution, canvas.width, canvas.height);
        gl.uniform1f(locs.u_rotation, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const scaled = _EmitterRenderSystem.QUAD.map((v) => v * p.size);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(scaled),
          gl.STATIC_DRAW
        );
        gl.enableVertexAttribArray(locs.a_position);
        gl.vertexAttribPointer(locs.a_position, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(
          locs.u_translation,
          base.position.x + p.x,
          base.position.y + p.y
        );
        gl.uniform4f(locs.u_color, 1, 1, 1, alpha);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });
    });
  }
};
_EmitterRenderSystem.QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
var EmitterRenderSystem = _EmitterRenderSystem;

// src/core/systems/ParticleSystem.ts
var ParticleSystem = class extends System {
  constructor() {
    super(...arguments);
    this.componentTypes = [
      TransformComponent.TYPE,
      ParticleEmitterComponent.TYPE
    ];
    this.priority = 15;
  }
  update(entities, dt) {
    entities.forEach((e) => {
      const pe = e.getComponent(
        ParticleEmitterComponent.TYPE
      );
      pe.elapsed += dt;
      pe.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.life += dt;
      });
      pe.particles = pe.particles.filter((p) => p.life < p.maxLife);
      if (pe.elapsed >= pe.maxLifetime && pe.particles.length === 0) {
        this.world?.removeEntity(e.id);
      }
    });
  }
};

// src/core/config/time.ts
var TARGET_FPS = 60;
var FRAME_TIME = 1 / TARGET_FPS;

// src/core/systems/PhysicsSystem.ts
var PhysicsSystem = class extends System {
  constructor() {
    super(...arguments);
    this.componentTypes = [TransformComponent.TYPE, PhysicsComponent.TYPE];
    this.priority = 10;
  }
  update(entities, deltaTime) {
    const timeScale = deltaTime * TARGET_FPS;
    const { canvas } = getWebGLContext();
    const width = canvas.width;
    const height = canvas.height;
    entities.forEach((entity) => {
      const transform = entity.getComponent(
        TransformComponent.TYPE
      );
      const physics = entity.getComponent(
        PhysicsComponent.TYPE
      );
      if (!transform || !physics) return;
      physics.velocity.x += physics.acceleration.x * timeScale;
      physics.velocity.y += physics.acceleration.y * timeScale;
      physics.velocity.x *= Math.pow(physics.friction, timeScale);
      physics.velocity.y *= Math.pow(physics.friction, timeScale);
      if (physics.maxSpeed !== void 0) {
        const speed = Math.hypot(physics.velocity.x, physics.velocity.y);
        if (speed > physics.maxSpeed) {
          const factor = physics.maxSpeed / speed;
          physics.velocity.x *= factor;
          physics.velocity.y *= factor;
        }
      }
      if (Math.abs(physics.velocity.x) < 1e-3) physics.velocity.x = 0;
      if (Math.abs(physics.velocity.y) < 1e-3) physics.velocity.y = 0;
      transform.position.x += physics.velocity.x * timeScale;
      transform.position.y += physics.velocity.y * timeScale;
      transform.rotation += physics.angularVelocity * timeScale;
      transform.rotation = transform.rotation % (Math.PI * 2);
      if (transform.rotation < 0) transform.rotation += Math.PI * 2;
      if (physics.wrapAroundEdges) {
        if (transform.position.x < 0) transform.position.x += width;
        if (transform.position.x > width) transform.position.x -= width;
        if (transform.position.y < 0) transform.position.y += height;
        if (transform.position.y > height) transform.position.y -= height;
      }
      physics.acceleration.x = 0;
      physics.acceleration.y = 0;
    });
  }
};

// src/core/systems/RenderSystem.ts
var RenderSystem = class extends System {
  constructor(clearScreen = true, backgroundColor = [0, 0, 0, 1]) {
    super();
    this.componentTypes = [TransformComponent.TYPE, RenderComponent.TYPE];
    this.priority = 100;
    this.clearScreen = true;
    this.backgroundColor = [0, 0, 0, 1];
    this.clearScreen = clearScreen;
    this.backgroundColor = backgroundColor;
  }
  update(entities) {
    const { gl, canvas, positionBuffer, locs } = getWebGLContext();
    if (this.clearScreen) {
      gl.clearColor(
        this.backgroundColor[0],
        this.backgroundColor[1],
        this.backgroundColor[2],
        this.backgroundColor[3]
      );
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const orderedEntities = entities.filter((entity) => {
      const render = entity.getComponent(
        RenderComponent.TYPE
      );
      return render && render.visible;
    }).sort((a, b) => {
      const renderA = a.getComponent(RenderComponent.TYPE);
      const renderB = b.getComponent(RenderComponent.TYPE);
      if (!renderA || !renderB) return 0;
      return renderA.zIndex - renderB.zIndex;
    });
    orderedEntities.forEach((entity) => {
      const transform = entity.getComponent(
        TransformComponent.TYPE
      );
      const render = entity.getComponent(RenderComponent.TYPE);
      if (!transform || !render || !locs) return;
      gl.useProgram(locs.program);
      gl.uniform2f(locs.u_resolution, canvas.width, canvas.height);
      gl.uniform2f(
        locs.u_translation,
        transform.position.x,
        transform.position.y
      );
      gl.uniform1f(locs.u_rotation, transform.rotation);
      gl.uniform4f(
        locs.u_color,
        render.color.r,
        render.color.g,
        render.color.b,
        render.color.a
      );
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, render.vertices, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(locs.a_position);
      gl.vertexAttribPointer(locs.a_position, 2, gl.FLOAT, false, 0, 0);
      let drawMode;
      switch (render.drawMode) {
        case "line_loop":
          drawMode = gl.LINE_LOOP;
          break;
        case "lines":
          drawMode = gl.LINES;
          break;
        case "points":
          drawMode = gl.POINTS;
          break;
        case "triangles":
        default:
          drawMode = gl.TRIANGLES;
          break;
      }
      gl.drawArrays(drawMode, 0, render.vertices.length / 2);
    });
  }
  setClearScreen(clear) {
    this.clearScreen = clear;
  }
  setBackgroundColor(r, g, b, a = 1) {
    this.backgroundColor = [r, g, b, a];
  }
};

// src/core/input/KeyboardInputSystem.ts
var KeyboardInputSystem = class {
  constructor(keyboard) {
    this.keyboard = keyboard;
  }
  getDirection() {
    const keys = this.keyboard.getState();
    return {
      x: (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0),
      y: (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0)
    };
  }
  getActions() {
    const keys = this.keyboard.getState();
    return {
      fire: keys.Space,
      boost: keys.ShiftLeft || keys.ShiftRight
    };
  }
  update() {
  }
};

// src/scaffold/BaseGame.ts
var BaseGame = class {
  constructor() {
    this.initialized = false;
    this.running = false;
    this.world = new World();
    this.config = this.getDefaultConfig();
  }
  setInputSystem(inputSystem) {
    this.inputSystem = inputSystem;
  }
  getInputSystem() {
    return this.inputSystem;
  }
  async initialize(world, config) {
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
  start() {
    if (!this.initialized) {
      throw new Error(
        "O jogo n\xE3o foi inicializado. Chame initialize() primeiro."
      );
    }
    this.world.start();
    this.running = true;
    this.world.emit(GAME_EVENTS.STARTED, { game: this });
  }
  pause() {
    if (this.running) {
      this.world.stop();
      this.running = false;
      this.world.emit(GAME_EVENTS.PAUSED, { game: this });
    }
  }
  resume() {
    if (!this.running && this.initialized) {
      this.world.start();
      this.running = true;
      this.world.emit(GAME_EVENTS.RESUMED, { game: this });
    }
  }
  stop() {
    if (this.initialized) {
      this.world.stop();
      this.running = false;
      this.world.emit(GAME_EVENTS.STOPPED, { game: this });
    }
  }
  async restart() {
    this.stop();
    this.world.clear();
    await this.initialize(void 0, this.config);
    this.start();
    this.world.emit(GAME_EVENTS.RESTARTED, { game: this });
  }
  getWorld() {
    return this.world;
  }
  getConfig() {
    return this.config;
  }
  isRunning() {
    return this.running;
  }
  isInitialized() {
    return this.initialized;
  }
};

// src/manager.ts
var Manager = class _Manager {
  constructor() {
    this.lastTime = 0;
    this.isRunning = false;
  }
  static getInstance() {
    if (!_Manager.instance) {
      _Manager.instance = new _Manager();
    }
    return _Manager.instance;
  }
  async rebindCanvas(canvas) {
    clearWebGLContext();
    await initWebGLContext(canvas);
  }
  async startGame(game, canvas, config) {
    if (!this.inputSystem) throw new Error("InputSystem n\xE3o configurado");
    await initWebGLContext(canvas);
    if (!this.hasActiveGame()) {
      await game.initialize(void 0, config);
      game.setInputSystem(this.inputSystem);
      this.activeGame = game;
      this.startGameLoop();
      game.start();
    } else {
      this.startGameLoop();
      game.resume();
    }
    return () => this.pauseGame();
  }
  setInputHandler(keyboard) {
    this.inputSystem = new KeyboardInputSystem(keyboard);
    if (this.activeGame) {
      this.activeGame.setInputSystem(this.inputSystem);
    }
  }
  startGameLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now() / 1e3;
    const loop = (timestamp) => {
      if (!this.isRunning) return;
      const now = timestamp / 1e3;
      const deltaTime = now - this.lastTime;
      this.lastTime = now;
      this.inputSystem?.update();
      if (this.activeGame) {
        this.activeGame.getWorld().update(deltaTime);
      }
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }
  stopGameLoop() {
    if (!this.isRunning) return;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = void 0;
    }
    this.isRunning = false;
  }
  stopGame() {
    this.stopGameLoop();
    if (this.activeGame) {
      this.activeGame.stop();
      this.activeGame = void 0;
    }
    MessageBus.getInstance().clearAllListeners();
  }
  pauseGame() {
    if (this.activeGame) {
      this.activeGame.pause();
      this.stopGameLoop();
    }
  }
  resumeGame() {
    if (this.activeGame) {
      this.activeGame.resume();
      this.startGameLoop();
    }
  }
  getActiveGame() {
    return this.activeGame;
  }
  hasActiveGame() {
    return this.activeGame !== void 0;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseGame,
  COLLISION_EVENTS,
  ColliderComponent,
  ColliderType,
  CollisionSystem,
  Component,
  ENTITY_EVENTS,
  EmitterRenderSystem,
  Entity,
  FRAME_TIME,
  GAME_EVENTS,
  KeyboardInputSystem,
  MESSAGE_TYPES,
  Manager,
  MessageBus,
  PLAYER_EVENTS,
  PROJECTILE_EVENTS,
  ParticleEmitterComponent,
  ParticleSystem,
  PhysicsComponent,
  PhysicsSystem,
  RenderComponent,
  RenderSystem,
  System,
  TARGET_FPS,
  TransformComponent,
  WORLD_EVENTS,
  WebGLContext,
  World,
  clearWebGLContext,
  getWebGLContext,
  initWebGLContext
});
