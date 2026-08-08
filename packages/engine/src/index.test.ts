import { describe, expect, it } from "vitest";

import * as engine from "./index";
import type { InputSystem } from "./index";

describe("barrel público", () => {
  /**
   * `InputSystem` is erased at runtime, so the guard is the annotation below:
   * it stops typechecking if the contract ever falls out of the barrel again
   * (see #60). Without it only the implementation is reachable, and nobody can
   * type an alternative input against the engine.
   */
  it("expõe o contrato de input, não só a implementação de teclado", () => {
    const input: InputSystem = new engine.KeyboardInputSystem({
      getState: () => ({
        ArrowRight: true,
        Space: true,
        ShiftLeft: false,
        ShiftRight: false,
      }),
    });

    expect(input.getDirection()).toEqual({ x: 1, y: 0 });
    expect(input.getActions()).toEqual({ fire: true, boost: false });
  });

  it("expõe o núcleo, o scaffold e o manager", () => {
    expect(engine.World).toBeTypeOf("function");
    expect(engine.Entity).toBeTypeOf("function");
    expect(engine.TransformComponent).toBeTypeOf("function");
    expect(engine.PhysicsSystem).toBeTypeOf("function");
    expect(engine.MessageBus).toBeTypeOf("function");
    expect(engine.BaseGame).toBeTypeOf("function");
    expect(engine.Manager).toBeTypeOf("function");
    expect(engine.initWebGLContext).toBeTypeOf("function");
    expect(engine.DEFAULT_VERTEX_SHADER).toBeTypeOf("string");
  });
});
