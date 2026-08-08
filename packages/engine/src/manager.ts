import { Game, GameConfig } from "./scaffold/Game";
import { InputSystem } from "./core/input/InputSystem";
import {
  KeyboardInputSystem,
  KeyboardHandler,
} from "./core/input/KeyboardInputSystem";
import { MessageBus } from "./core/messaging/MessageBus";
import {
  initWebGLContext,
  clearWebGLContext,
  WebGLContextOptions,
} from "./core/rendering/Context";
import { CanvasSizeSource, fixedCanvasSize } from "./core/rendering/canvasSize";

export class Manager {
  private static instance: Manager;

  private activeGame?: Game;

  private inputSystem?: InputSystem;

  private animFrameId?: number;

  private lastTime: number = 0;

  private isRunning: boolean = false;

  private webglOptions: WebGLContextOptions = {};

  private canvasSize?: CanvasSizeSource;

  static getInstance(): Manager {
    if (!Manager.instance) {
      Manager.instance = new Manager();
    }
    return Manager.instance;
  }

  private constructor() {}

  /**
   * Overrides the shaders used when the WebGL context is created. Without it
   * the engine uses the built-in ones (`DEFAULT_VERTEX_SHADER` /
   * `DEFAULT_FRAGMENT_SHADER`).
   *
   * Must be called before `startGame`: after that the context already exists
   * and is only recompiled on a `rebindCanvas`.
   */
  setShaders(options: WebGLContextOptions): void {
    this.webglOptions = options;
  }

  rebindCanvas(canvas: HTMLCanvasElement): void {
    clearWebGLContext();
    initWebGLContext(canvas, this.contextOptions());
  }

  async startGame(
    game: Game,
    canvas: HTMLCanvasElement,
    config?: Partial<GameConfig>
  ): Promise<() => void> {
    if (!this.inputSystem) throw new Error("InputSystem não configurado");

    this.canvasSize = this.resolveCanvasSize(game, config);
    initWebGLContext(canvas, this.contextOptions());

    if (!this.hasActiveGame()) {
      await game.initialize(undefined, config);
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

  private contextOptions(): WebGLContextOptions {
    return this.canvasSize
      ? { ...this.webglOptions, size: this.canvasSize }
      : this.webglOptions;
  }

  /**
   * Honors `GameConfig.canvasWidth`/`canvasHeight` when the game declares both,
   * merged with the caller's overrides. Without them the canvas keeps following
   * its own layout size.
   */
  private resolveCanvasSize(
    game: Game,
    config?: Partial<GameConfig>
  ): CanvasSizeSource | undefined {
    const { canvasWidth, canvasHeight } = { ...game.getConfig(), ...config };

    return canvasWidth !== undefined && canvasHeight !== undefined
      ? fixedCanvasSize(canvasWidth, canvasHeight)
      : undefined;
  }

  setInputHandler(keyboard: KeyboardHandler): void {
    this.inputSystem = new KeyboardInputSystem(keyboard);
    if (this.activeGame) {
      this.activeGame.setInputSystem(this.inputSystem);
    }
  }

  private startGameLoop(): void {
    if (this.isRunning) return;

    this.isRunning = true;

    this.lastTime = performance.now() / 1000;

    const loop = (timestamp: number) => {
      if (!this.isRunning) return;

      const now = timestamp / 1000;

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

  private stopGameLoop(): void {
    if (!this.isRunning) return;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = undefined;
    }

    this.isRunning = false;
  }

  stopGame(): void {
    this.stopGameLoop();

    if (this.activeGame) {
      this.activeGame.stop();
      this.activeGame = undefined;
    }

    clearWebGLContext();
    this.canvasSize = undefined;

    MessageBus.getInstance().clearAllListeners();
  }

  pauseGame(): void {
    if (this.activeGame) {
      this.activeGame.pause();
      this.stopGameLoop();
    }
  }

  resumeGame(): void {
    if (this.activeGame) {
      this.activeGame.resume();
      this.startGameLoop();
    }
  }

  getActiveGame(): Game | undefined {
    return this.activeGame;
  }

  hasActiveGame(): boolean {
    return this.activeGame !== undefined;
  }
}
