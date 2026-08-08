import { describe, expect, it } from "vitest";
import { PhysicsComponent } from "./PhysicsComponent";

describe("PhysicsComponent", () => {
  /**
   * A ordem posicional do construtor é (friction, wrapAroundEdges, mass,
   * maxSpeed) — sem nomeação, é fácil errar na chamada. Este teste fixa o
   * contrato para que uma troca de argumentos apareça aqui, e não como um
   * bug sutil de gameplay.
   */
  it("mapeia os argumentos posicionais na ordem declarada", () => {
    const physics = new PhysicsComponent(0.9, false, 5, 12);

    expect(physics.friction).toBe(0.9);
    expect(physics.wrapAroundEdges).toBe(false);
    expect(physics.mass).toBe(5);
    expect(physics.maxSpeed).toBe(12);
  });

  it("usa os defaults quando construído sem argumentos", () => {
    const physics = new PhysicsComponent();

    expect(physics.friction).toBe(0.99);
    expect(physics.wrapAroundEdges).toBe(true);
    expect(physics.mass).toBe(1);
    expect(physics.maxSpeed).toBeUndefined();
    expect(physics.velocity).toEqual({ x: 0, y: 0 });
    expect(physics.acceleration).toEqual({ x: 0, y: 0 });
    expect(physics.angularVelocity).toBe(0);
  });

  it("angularVelocity não é parâmetro do construtor — só o setter o define", () => {
    const physics = new PhysicsComponent(1, true, 0.5, 3);

    expect(physics.angularVelocity).toBe(0);

    physics.setAngularVelocity(0.02);
    expect(physics.angularVelocity).toBe(0.02);
  });

  describe("forças e impulsos", () => {
    it("applyForce divide pela massa e acumula na aceleração", () => {
      const physics = new PhysicsComponent(0.99, true, 2);

      physics.applyForce(10, -4).applyForce(2, 0);

      expect(physics.acceleration).toEqual({ x: 6, y: -2 });
    });

    it("applyImpulse divide pela massa e acumula na velocidade", () => {
      const physics = new PhysicsComponent(0.99, true, 4);

      physics.applyImpulse(8, 16);

      expect(physics.velocity).toEqual({ x: 2, y: 4 });
    });

    /**
     * Caracterização de uma armadilha da API: massa é um divisor sem
     * validação. Massa próxima de zero explode a aceleração e massa negativa
     * inverte o sentido da força aplicada.
     */
    it("massa negativa inverte o sentido da força", () => {
      const physics = new PhysicsComponent(1, true, -0.01);

      physics.applyForce(1, 0);

      expect(physics.acceleration.x).toBe(-100);
    });
  });

  describe("limite de velocidade", () => {
    it("setVelocity aplica o clamp preservando a direção", () => {
      const physics = new PhysicsComponent(0.99, true, 1, 5);

      physics.setVelocity(30, 40);

      expect(physics.velocity.x).toBeCloseTo(3);
      expect(physics.velocity.y).toBeCloseTo(4);
    });

    it("setMaxSpeed reavalia a velocidade já existente", () => {
      const physics = new PhysicsComponent();
      physics.setVelocity(30, 40);

      physics.setMaxSpeed(5);

      expect(Math.hypot(physics.velocity.x, physics.velocity.y)).toBeCloseTo(5);
    });

    it("não altera velocidades abaixo do limite", () => {
      const physics = new PhysicsComponent(0.99, true, 1, 100);

      physics.setVelocity(3, 4);

      expect(physics.velocity).toEqual({ x: 3, y: 4 });
    });
  });
});
