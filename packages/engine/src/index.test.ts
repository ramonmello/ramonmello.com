import { describe, expect, it } from "vitest";

import * as engine from "./index";
import type { InputSystem, SystemPhase } from "./index";

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

  it("expõe o núcleo, o scaffold e a engine", () => {
    expect(engine.World).toBeTypeOf("function");
    expect(engine.Entity).toBeTypeOf("function");
    expect(engine.TransformComponent).toBeTypeOf("function");
    expect(engine.PhysicsSystem).toBeTypeOf("function");
    expect(engine.MessageBus).toBeTypeOf("function");
    expect(engine.BaseGame).toBeTypeOf("function");
    expect(engine.Engine).toBeTypeOf("function");
    expect(engine.createWebGLContext).toBeTypeOf("function");
    expect(engine.DEFAULT_VERTEX_SHADER).toBeTypeOf("string");
  });

  /**
   * A cadência do loop é contrato: um jogo calibra velocidades por passo e
   * precisa das mesmas constantes que a `Engine` usa, além do tipo que marca um
   * sistema como sendo da fase de render.
   */
  it("expõe as constantes do passo fixo e o tipo de fase", () => {
    const phase: SystemPhase = "render";

    expect(engine.FRAME_TIME).toBeCloseTo(1 / engine.TARGET_FPS);
    expect(engine.MAX_FRAME_TIME).toBeGreaterThan(engine.FRAME_TIME);
    expect(phase).toBe("render");
  });

  /**
   * Critério de aceite de #62: nada de `getInstance()` na superfície pública.
   * O barrel é onde isso é fácil de verificar de uma vez só.
   */
  it("não expõe nenhum singleton via getInstance()", () => {
    const withGetInstance = Object.entries(engine)
      .filter(
        ([, value]) =>
          typeof value === "function" &&
          typeof (value as { getInstance?: unknown }).getInstance === "function"
      )
      .map(([name]) => name);

    expect(withGetInstance).toEqual([]);
  });
});
