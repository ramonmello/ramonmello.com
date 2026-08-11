import { describe, expect, it } from "vitest";
import { TransformComponent } from "./TransformComponent";

describe("TransformComponent", () => {
  describe("interpolação", () => {
    it("começa sem histórico: a pose inicial é a origem", () => {
      const transform = new TransformComponent(10, 20, 1);

      expect(transform.interpolatedX(0.5)).toBe(10);
      expect(transform.interpolatedY(0.5)).toBe(20);
      expect(transform.interpolatedRotation(0.5)).toBe(1);
    });

    it("mistura a pose do início do passo com a do fim", () => {
      const transform = new TransformComponent(0, 0);

      transform.beginStep();
      transform.translate(10, 40);

      expect(transform.interpolatedX(0)).toBeCloseTo(0);
      expect(transform.interpolatedX(0.25)).toBeCloseTo(2.5);
      expect(transform.interpolatedY(0.5)).toBeCloseTo(20);
    });

    it("cada passo parte de onde o anterior terminou", () => {
      const transform = new TransformComponent(0, 0);

      transform.beginStep();
      transform.translate(10, 0);
      transform.beginStep();
      transform.translate(10, 0);

      expect(transform.interpolatedX(0.5)).toBeCloseTo(15);
    });

    it("gira pelo arco mais curto ao cruzar a emenda em 0/2π", () => {
      const transform = new TransformComponent(0, 0, 0.1);

      transform.beginStep();
      // O passo recuou 0,2rad e a normalização devolveu o ângulo perto de 2π:
      // interpolar de 0,1 até 6,18 daria uma pirueta completa em um frame.
      transform.rotation = Math.PI * 2 - 0.1;

      expect(transform.interpolatedRotation(0.5)).toBeCloseTo(0);
    });

    it("um teleporte não é desenhado como deslizamento", () => {
      const transform = new TransformComponent(0, 0);

      transform.beginStep();
      transform.setPosition(500, 500);

      expect(transform.interpolatedX(0.5)).toBe(500);
      expect(transform.interpolatedY(0.5)).toBe(500);
    });

    it("setRotation também descarta o histórico", () => {
      const transform = new TransformComponent(0, 0, 0);

      transform.beginStep();
      transform.setRotation(Math.PI);

      expect(transform.interpolatedRotation(0.5)).toBe(Math.PI);
    });
  });
});
