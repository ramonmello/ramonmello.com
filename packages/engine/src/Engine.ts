import { Game, GameConfig } from "./scaffold/Game";
import { InputSystem } from "./core/input/InputSystem";
import { World } from "./core/base/World";
import {
  createWebGLContext,
  WebGLContext,
  WebGLContextOptions,
} from "./core/rendering/Context";
import { CanvasSizeSource, fixedCanvasSize } from "./core/rendering/canvasSize";
import { FRAME_TIME, MAX_FRAME_TIME } from "./core/config/time";

export interface EngineOptions {
  /** Canvas this engine draws to. One engine, one canvas. */
  canvas: HTMLCanvasElement;

  /** Game to run. Owned by the engine from construction to `destroy`. */
  game: Game;

  /** Where `ShipControlSystem` and friends read the player's intent from. */
  input?: InputSystem;

  /** Overrides merged over the game's own `GameConfig`. */
  config?: Partial<GameConfig>;

  /** Custom GLSL. Without it the engine compiles its built-in shaders. */
  shaders?: Pick<WebGLContextOptions, "vertexShader" | "fragmentShader">;
}

/**
 * Runs one game on one canvas.
 *
 * Everything the run needs — the WebGL context, the game, its world, and the
 * animation frame loop — belongs to the instance, so two engines can render two
 * games side by side without seeing each other. Build one per canvas and call
 * {@link destroy} when the canvas goes away.
 */
export class Engine {
  private readonly game: Game;

  private readonly config?: Partial<GameConfig>;

  private readonly shaders: Pick<
    WebGLContextOptions,
    "vertexShader" | "fragmentShader"
  >;

  private readonly canvasSize?: CanvasSizeSource;

  private context: WebGLContext;

  private input?: InputSystem;

  private animFrameId?: number;

  private lastTime?: number;

  private accumulator: number = 0;

  private running: boolean = false;

  private initialized: boolean = false;

  private startPromise?: Promise<void>;

  private destroyed: boolean = false;

  constructor(options: EngineOptions) {
    this.game = options.game;
    this.config = options.config;
    this.shaders = options.shaders ?? {};
    this.input = options.input;
    this.canvasSize = this.resolveCanvasSize();

    this.context = createWebGLContext(options.canvas, this.contextOptions());
    this.getWorld().setRenderContext(this.context);
  }

  /**
   * Initializes the game on first call and starts the loop; afterwards it just
   * resumes. Safe to call repeatedly, including while the first call is still
   * awaiting `initialize` — every caller joins the same bootstrap, so systems
   * and entities are never built twice.
   */
  async start(): Promise<void> {
    this.assertUsable();

    if (this.startPromise) {
      await this.startPromise;
      if (!this.destroyed) this.resume();
      return;
    }

    this.startPromise = this.bootstrap();
    await this.startPromise;
  }

  /** Halts the loop and the game, keeping the world and the context alive. */
  pause(): void {
    if (!this.initialized || this.destroyed) return;

    this.stopLoop();
    this.game.pause();
  }

  /** Picks the run back up from where {@link pause} left it. */
  resume(): void {
    this.assertUsable();
    if (!this.initialized) return;

    this.game.resume();
    this.startLoop();
  }

  /** Stops the run for good, without tearing down the world or the context. */
  stop(): void {
    if (!this.initialized || this.destroyed) return;

    this.stopLoop();
    this.game.stop();
  }

  /**
   * Tears the engine down: stops the loop, destroys the world (clearing its
   * own bus and nobody else's) and disposes the WebGL context. The instance is
   * unusable afterwards.
   */
  destroy(): void {
    if (this.destroyed) return;

    this.stopLoop();
    this.destroyed = true;

    if (this.initialized) {
      this.game.stop();
    }

    this.getWorld().destroy();
    this.context.dispose();
  }

  /**
   * Moves the run to another canvas. The old context is dropped and a new one
   * is compiled for the new element — a WebGL context cannot be re-pointed at
   * a different canvas.
   */
  setCanvas(canvas: HTMLCanvasElement): void {
    this.assertUsable();

    this.context.dispose();
    this.context = createWebGLContext(canvas, this.contextOptions());
    this.getWorld().setRenderContext(this.context);
  }

  /** Swaps the input source, e.g. when the host rebuilds its key handler. */
  setInput(input: InputSystem): void {
    this.input = input;
    this.game.setInputSystem(input);
  }

  getGame(): Game {
    return this.game;
  }

  getWorld(): World {
    return this.game.getWorld();
  }

  getContext(): WebGLContext {
    return this.context;
  }

  isRunning(): boolean {
    return this.running;
  }

  private async bootstrap(): Promise<void> {
    await this.game.initialize(undefined, this.config);

    if (this.destroyed) return;

    if (this.input) {
      this.game.setInputSystem(this.input);
    }

    this.initialized = true;
    this.startLoop();
    this.game.start();
  }

  private contextOptions(): WebGLContextOptions {
    return this.canvasSize
      ? { ...this.shaders, size: this.canvasSize }
      : this.shaders;
  }

  /**
   * Honors `GameConfig.canvasWidth`/`canvasHeight` when the game declares both,
   * merged with the caller's overrides. Without them the canvas keeps following
   * its own layout size.
   */
  private resolveCanvasSize(): CanvasSizeSource | undefined {
    const { canvasWidth, canvasHeight } = {
      ...this.game.getConfig(),
      ...this.config,
    };

    return canvasWidth !== undefined && canvasHeight !== undefined
      ? fixedCanvasSize(canvasWidth, canvasHeight)
      : undefined;
  }

  /**
   * Drives the run on a fixed step. The simulation only ever advances in
   * `FRAME_TIME` slices, so the same input yields the same outcome on a 30Hz
   * laptop and a 144Hz monitor; whatever elapsed time does not fill a whole
   * slice stays in the accumulator and becomes the interpolation factor the
   * render pass draws with.
   */
  private startLoop(): void {
    if (this.running || this.destroyed) return;

    this.running = true;
    this.lastTime = undefined;
    this.accumulator = 0;

    const loop = (timestamp: number) => {
      if (!this.running) return;

      const now = timestamp / 1000;
      // The first frame of a run has no predecessor to measure against: it
      // only seeds the clock. Later frames are capped, so a tab returning
      // from the background is simulated up to the ceiling and no further.
      const frameTime =
        this.lastTime === undefined
          ? 0
          : Math.min(Math.max(now - this.lastTime, 0), MAX_FRAME_TIME);

      this.lastTime = now;
      this.accumulator += frameTime;

      this.input?.update();

      const world = this.getWorld();
      while (this.accumulator >= FRAME_TIME) {
        world.update(FRAME_TIME);
        this.accumulator -= FRAME_TIME;
      }

      world.render(this.accumulator / FRAME_TIME);

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  private stopLoop(): void {
    if (!this.running) return;

    if (this.animFrameId !== undefined) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = undefined;
    }

    this.running = false;
  }

  private assertUsable(): void {
    if (this.destroyed) {
      throw new Error("Engine has been destroyed; build a new one.");
    }
  }
}
