import { InputSystem } from "./InputSystem";

export type KeyState = { [key: string]: boolean };
export interface KeyboardHandler {
  getState(): KeyState;
}

export class KeyboardInputSystem implements InputSystem {
  constructor(private keyboard: KeyboardHandler) {}

  getDirection(): { x: number; y: number } {
    const keys = this.keyboard.getState();
    return {
      x: (keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0),
      y: (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0),
    };
  }

  getActions(): { [key: string]: boolean } {
    const keys = this.keyboard.getState();
    return {
      fire: keys.Space,
      boost: keys.ShiftLeft || keys.ShiftRight,
    };
  }

  update(): void {}
}
