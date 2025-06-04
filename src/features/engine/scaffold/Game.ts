import { World } from "../core/base/World";
import { InputSystem } from "../core/input/InputSystem";

export interface GameConfig {
  canvasWidth: number;

  canvasHeight: number;

  debug?: boolean;

  [key: string]: unknown;
}

export interface Game {
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
