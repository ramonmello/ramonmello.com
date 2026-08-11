import { beforeEach, describe, expect, it } from "vitest";
import { Entity } from "../base/Entity";
import { World } from "../base/World";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { TransformComponent } from "../components/TransformComponent";
import { PhysicsSystem } from "./PhysicsSystem";
import { TARGET_FPS } from "../config/time";
import type { WebGLContext } from "../rendering/Context";

const CANVAS = { width: 800, height: 600 };

// O sistema só olha o canvas para fazer o wrap nas bordas, então um contexto
// com nada além dele basta — o teste segue sem DOM e sem GPU.
const RENDER_CONTEXT = { canvas: CANVAS } as unknown as WebGLContext;

/** Um frame exato a 60fps, onde `timeScale` vale 1. */
const ONE_FRAME = 1 / TARGET_FPS;

function makeBody(
  physics: PhysicsComponent,
  x = 0,
  y = 0,
  rotation = 0
): { entity: Entity; transform: TransformComponent } {
  const entity = new Entity();
  const transform = new TransformComponent(x, y, rotation);
  entity.addComponent(transform).addComponent(physics);
  return { entity, transform };
}

describe("PhysicsSystem", () => {
  let system: PhysicsSystem;

  beforeEach(() => {
    system = new PhysicsSystem();
    system.setWorld(new World({ renderContext: RENDER_CONTEXT }));
  });

  describe("integração", () => {
    it("acumula aceleração na velocidade e velocidade na posição", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setAcceleration(10, -4);
      const { entity, transform } = makeBody(physics);

      system.update([entity], ONE_FRAME);

      expect(physics.velocity).toEqual({ x: 10, y: -4 });
      expect(transform.position).toEqual({ x: 10, y: -4 });
    });

    it("zera a aceleração ao fim de cada frame", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setAcceleration(10, 10);
      const { entity } = makeBody(physics);

      system.update([entity], ONE_FRAME);
      system.update([entity], ONE_FRAME);

      // Aceleração aplicada só no primeiro frame: velocidade não dobra.
      expect(physics.velocity).toEqual({ x: 10, y: 10 });
      expect(physics.acceleration).toEqual({ x: 0, y: 0 });
    });

    it("escala o passo pelo deltaTime relativo a 60fps", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setVelocity(10, 0);
      const { entity, transform } = makeBody(physics);

      system.update([entity], ONE_FRAME * 2);

      expect(transform.position.x).toBeCloseTo(20);
    });

    it("aplica atrito exponencialmente no tempo", () => {
      const physics = new PhysicsComponent(0.5, false);
      physics.setVelocity(100, 0);
      const { entity } = makeBody(physics);

      system.update([entity], ONE_FRAME * 2);

      expect(physics.velocity.x).toBeCloseTo(25);
    });

    it("limita a velocidade ao maxSpeed preservando a direção", () => {
      const physics = new PhysicsComponent(1, false, 1, 5);
      physics.velocity = { x: 30, y: 40 };
      const { entity } = makeBody(physics);

      system.update([entity], ONE_FRAME);

      expect(Math.hypot(physics.velocity.x, physics.velocity.y)).toBeCloseTo(5);
      expect(physics.velocity.x).toBeCloseTo(3);
      expect(physics.velocity.y).toBeCloseTo(4);
    });

    it("zera velocidades residuais abaixo de 0.001", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setVelocity(0.0005, -0.0005);
      const { entity } = makeBody(physics);

      system.update([entity], ONE_FRAME);

      expect(physics.velocity).toEqual({ x: 0, y: 0 });
    });
  });

  describe("rotação", () => {
    it("integra a velocidade angular", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setAngularVelocity(0.25);
      const { entity, transform } = makeBody(physics);

      system.update([entity], ONE_FRAME);

      expect(transform.rotation).toBeCloseTo(0.25);
    });

    it("normaliza a rotação para o intervalo [0, 2π)", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setAngularVelocity(Math.PI * 3);
      const { entity, transform } = makeBody(physics);

      system.update([entity], ONE_FRAME);

      expect(transform.rotation).toBeCloseTo(Math.PI);
    });

    it("converte rotação negativa para o equivalente positivo", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setAngularVelocity(-Math.PI / 2);
      const { entity, transform } = makeBody(physics);

      system.update([entity], ONE_FRAME);

      expect(transform.rotation).toBeCloseTo((3 * Math.PI) / 2);
    });
  });

  describe("wrap nas bordas", () => {
    it("reposiciona quem sai pela esquerda/topo", () => {
      const physics = new PhysicsComponent(1, true);
      physics.setVelocity(-20, -20);
      const { entity, transform } = makeBody(physics, 5, 5);

      system.update([entity], ONE_FRAME);

      expect(transform.position.x).toBeCloseTo(CANVAS.width - 15);
      expect(transform.position.y).toBeCloseTo(CANVAS.height - 15);
    });

    it("reposiciona quem sai pela direita/base", () => {
      const physics = new PhysicsComponent(1, true);
      physics.setVelocity(20, 20);
      const { entity, transform } = makeBody(
        physics,
        CANVAS.width - 5,
        CANVAS.height - 5
      );

      system.update([entity], ONE_FRAME);

      expect(transform.position.x).toBeCloseTo(15);
      expect(transform.position.y).toBeCloseTo(15);
    });

    it("traz de volta saltos maiores que o canvas inteiro", () => {
      const physics = new PhysicsComponent(1, true);
      physics.setVelocity(-100, 0);
      const { entity, transform } = makeBody(physics, 0, 0);

      // -6000px de uma vez: somar `width` uma única vez não bastaria, e antes
      // do wrap por módulo a entidade sumia da tela para sempre.
      system.update([entity], ONE_FRAME * 60);

      expect(transform.position.x).toBeCloseTo(400);
    });

    it("arrasta a origem da interpolação junto com o corpo", () => {
      const physics = new PhysicsComponent(1, true);
      physics.setVelocity(-20, 0);
      const { entity, transform } = makeBody(physics, 5, 5);

      system.update([entity], ONE_FRAME);

      // Sem deslocar a origem, o render desenharia o corpo atravessando a
      // tela inteira no frame do wrap em vez de reaparecer do outro lado.
      expect(transform.position.x - transform.previousPosition.x).toBeCloseTo(
        -20
      );
    });

    it("não reposiciona quando wrapAroundEdges está desligado", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setVelocity(-20, 0);
      const { entity, transform } = makeBody(physics, 5, 5);

      system.update([entity], ONE_FRAME);

      expect(transform.position.x).toBeCloseTo(-15);
    });

    it("num world headless não há bordas para envolver", () => {
      const headless = new PhysicsSystem();
      headless.setWorld(new World());
      const physics = new PhysicsComponent(1, true);
      physics.setVelocity(-20, 0);
      const { entity, transform } = makeBody(physics, 5, 5);

      headless.update([entity], ONE_FRAME);

      expect(transform.position.x).toBeCloseTo(-15);
    });
  });

  /**
   * O sistema integra linearmente no deltaTime que recebe; quem garante que
   * esse deltaTime é sempre um passo fixo é a Engine. Ver `Engine.test.ts`
   * para o clamp e a decomposição de frames longos.
   */
  describe("regressão: passos fixos não teleportam", () => {
    it("60 passos de um frame chegam onde o salto único chegava, mas passando pelo caminho", () => {
      const physics = new PhysicsComponent(1, false);
      physics.setVelocity(10, 0);
      const { entity, transform } = makeBody(physics);

      const jumps: number[] = [];
      let previous = transform.position.x;
      for (let i = 0; i < 60; i++) {
        system.update([entity], ONE_FRAME);
        jumps.push(transform.position.x - previous);
        previous = transform.position.x;
      }

      expect(transform.position.x).toBeCloseTo(600);
      // Nenhum passo pula um collider: o maior salto é o de um frame.
      expect(Math.max(...jumps)).toBeCloseTo(10);
    });
  });

  it("ignora entidades sem os dois componentes exigidos", () => {
    const orphan = new Entity();
    orphan.addComponent(new TransformComponent(0, 0));

    expect(() => system.update([orphan], ONE_FRAME)).not.toThrow();
  });
});
