import { Game, GameConfig } from "./scaffold/Game";
import { InputSystem } from "./core/input/InputSystem";
import { KeyboardInputSystem } from "./core/input/KeyboardInputSystem";
import { MessageBus } from "./core/messaging/MessageBus";
import { initWebGLContext, clearWebGLContext } from "./core/rendering/Context";
import type { KeyboardHandler } from "@games/hooks/useKeyboard";

export class Manager {
  private static instance: Manager;

  private activeGame?: Game;

  private inputSystem?: InputSystem;

  private animFrameId?: number;

  private lastTime: number = 0;

  private isRunning: boolean = false;

  static getInstance(): Manager {
    if (!Manager.instance) {
      Manager.instance = new Manager();
    }
    return Manager.instance;
  }

  private constructor() {}

  async rebindCanvas(canvas: HTMLCanvasElement): Promise<void> {
    clearWebGLContext();
    await initWebGLContext(canvas);
  }

  async startGame(
    game: Game,
    canvas: HTMLCanvasElement,
    config?: Partial<GameConfig>
  ): Promise<() => void> {
    if (!this.inputSystem) throw new Error("InputSystem não configurado");

    await initWebGLContext(canvas);

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
