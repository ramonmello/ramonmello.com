export interface InputSystem {
  getDirection(): { x: number; y: number };

  getActions(): { [key: string]: boolean };

  update(): void;
}
