import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { Entity } from "../base/Entity";
import { World } from "../base/World";
import { type MessageData } from "../messaging/MessageBus";
import { ColliderComponent, ColliderType } from "../components/ColliderComponent";
import { TransformComponent } from "../components/TransformComponent";
import { COLLISION_EVENTS } from "../messaging/MessageTypes";
import { CollisionSystem } from "./CollisionSystem";

function bodyAt(
  x: number,
  y: number,
  collider: ColliderComponent,
  id?: string
): Entity {
  const entity = new Entity(id);
  entity.addComponent(new TransformComponent(x, y)).addComponent(collider);
  return entity;
}

describe("CollisionSystem", () => {
  let system: CollisionSystem;
  let world: World;
  let onDetect: Mock<(data: MessageData) => void>;
  let onResolve: Mock<(data: MessageData) => void>;

  beforeEach(() => {
    world = new World();
    system = new CollisionSystem();
    system.setWorld(world);
    onDetect = vi.fn<(data: MessageData) => void>();
    onResolve = vi.fn<(data: MessageData) => void>();
    world.on(COLLISION_EVENTS.DETECT, onDetect);
    world.on(COLLISION_EVENTS.RESOLVE, onResolve);
  });

  describe("círculo x círculo", () => {
    it("detecta quando a distância é menor que a soma dos raios", () => {
      const a = bodyAt(0, 0, ColliderComponent.createCircle(10));
      const b = bodyAt(15, 0, ColliderComponent.createCircle(10));

      system.update([a, b]);

      expect(onDetect).toHaveBeenCalledOnce();
    });

    it("ignora quando estão separados", () => {
      const a = bodyAt(0, 0, ColliderComponent.createCircle(10));
      const b = bodyAt(25, 0, ColliderComponent.createCircle(10));

      system.update([a, b]);

      expect(onDetect).not.toHaveBeenCalled();
    });

    it("trata o contato exato na tangente como separação", () => {
      const a = bodyAt(0, 0, ColliderComponent.createCircle(10));
      const b = bodyAt(20, 0, ColliderComponent.createCircle(10));

      system.update([a, b]);

      expect(onDetect).not.toHaveBeenCalled();
    });
  });

  describe("retângulo x retângulo", () => {
    it("detecta sobreposição de AABBs", () => {
      const a = bodyAt(0, 0, ColliderComponent.createRectangle(20, 20));
      const b = bodyAt(15, 0, ColliderComponent.createRectangle(20, 20));

      system.update([a, b]);

      expect(onDetect).toHaveBeenCalledOnce();
    });

    it("ignora AABBs disjuntos", () => {
      const a = bodyAt(0, 0, ColliderComponent.createRectangle(20, 20));
      const b = bodyAt(25, 0, ColliderComponent.createRectangle(20, 20));

      system.update([a, b]);

      expect(onDetect).not.toHaveBeenCalled();
    });
  });

  describe("círculo x retângulo", () => {
    it("detecta independente da ordem dos participantes", () => {
      const circle = bodyAt(0, 0, ColliderComponent.createCircle(10));
      const rect = bodyAt(18, 0, ColliderComponent.createRectangle(20, 20));

      system.update([circle, rect]);
      system.update([rect, circle]);

      expect(onDetect).toHaveBeenCalledTimes(2);
    });

    it("ignora quando o círculo está fora do retângulo", () => {
      const circle = bodyAt(0, 0, ColliderComponent.createCircle(10));
      const rect = bodyAt(45, 0, ColliderComponent.createRectangle(20, 20));

      system.update([circle, rect]);

      expect(onDetect).not.toHaveBeenCalled();
    });
  });

  describe("offset do collider", () => {
    it("desloca o ponto de teste em relação ao transform", () => {
      const a = bodyAt(0, 0, ColliderComponent.createCircle(5));
      const b = bodyAt(30, 0, ColliderComponent.createCircle(5));

      system.update([a, b]);
      expect(onDetect).not.toHaveBeenCalled();

      a.getComponent<ColliderComponent>(ColliderComponent.TYPE)!.setOffset(
        22,
        0
      );
      system.update([a, b]);

      expect(onDetect).toHaveBeenCalledOnce();
    });
  });

  describe("filtros", () => {
    it("ignora colliders inativos", () => {
      const a = bodyAt(0, 0, ColliderComponent.createCircle(10).setActive(false));
      const b = bodyAt(5, 0, ColliderComponent.createCircle(10));

      system.update([a, b]);

      expect(onDetect).not.toHaveBeenCalled();
    });

    it("respeita layer e mask nos dois sentidos", () => {
      const a = bodyAt(
        0,
        0,
        ColliderComponent.createCircle(10).setLayer(0b001).setMask(0b010)
      );
      const b = bodyAt(
        5,
        0,
        ColliderComponent.createCircle(10).setLayer(0b100).setMask(0b111)
      );

      system.update([a, b]);

      // b.layer (0b100) & a.mask (0b010) === 0 → o par é descartado.
      expect(onDetect).not.toHaveBeenCalled();
    });

    it("colide quando as máscaras são compatíveis", () => {
      const a = bodyAt(
        0,
        0,
        ColliderComponent.createCircle(10).setLayer(0b001).setMask(0b100)
      );
      const b = bodyAt(
        5,
        0,
        ColliderComponent.createCircle(10).setLayer(0b100).setMask(0b001)
      );

      system.update([a, b]);

      expect(onDetect).toHaveBeenCalledOnce();
    });
  });

  describe("triggers", () => {
    it("emite DETECT e RESOLVE para dois corpos sólidos", () => {
      const a = bodyAt(0, 0, ColliderComponent.createCircle(10));
      const b = bodyAt(5, 0, ColliderComponent.createCircle(10));

      system.update([a, b]);

      expect(onDetect).toHaveBeenCalledOnce();
      expect(onResolve).toHaveBeenCalledOnce();
    });

    it("suprime RESOLVE se qualquer um dos lados for trigger", () => {
      const a = bodyAt(
        0,
        0,
        ColliderComponent.createCircle(10).setTrigger(true)
      );
      const b = bodyAt(5, 0, ColliderComponent.createCircle(10));

      system.update([a, b]);

      expect(onDetect).toHaveBeenCalledOnce();
      expect(onResolve).not.toHaveBeenCalled();
    });
  });

  describe("varredura de pares", () => {
    it("não testa uma entidade contra si mesma", () => {
      const solo = bodyAt(0, 0, ColliderComponent.createCircle(10));

      system.update([solo]);

      expect(onDetect).not.toHaveBeenCalled();
    });

    it("avalia cada par uma única vez", () => {
      const a = bodyAt(0, 0, ColliderComponent.createCircle(10), "a");
      const b = bodyAt(1, 0, ColliderComponent.createCircle(10), "b");
      const c = bodyAt(2, 0, ColliderComponent.createCircle(10), "c");

      system.update([a, b, c]);

      expect(onDetect).toHaveBeenCalledTimes(3);
    });

    it("publica os dois lados do par no payload", () => {
      const a = bodyAt(0, 0, ColliderComponent.createCircle(10), "a");
      const b = bodyAt(5, 0, ColliderComponent.createCircle(10), "b");

      system.update([a, b]);

      const payload = onDetect.mock.calls[0][0];
      expect(payload.entityA).toBe(a);
      expect(payload.entityB).toBe(b);
    });
  });

  /**
   * Caracterização: ColliderType.Polygon existe no enum e tem factory, mas
   * não tem narrowphase. Qualquer par que envolva um polígono cai no fallback
   * final, que aproxima ambos os lados por um círculo de raio mínimo 10.
   */
  it("caracterização: polígonos caem no fallback de círculo com raio mínimo 10", () => {
    const square = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
    const a = bodyAt(0, 0, ColliderComponent.createPolygon(square));
    const b = bodyAt(19, 0, ColliderComponent.createPolygon(square));
    const far = bodyAt(100, 0, ColliderComponent.createPolygon(square));

    system.update([a, b]);
    expect(onDetect).toHaveBeenCalledOnce();

    onDetect.mockClear();
    system.update([a, far]);
    expect(onDetect).not.toHaveBeenCalled();
  });

  it("ignora colliders de tipo Polygon com raio real declarado", () => {
    const collider = ColliderComponent.createPolygon(new Float32Array([0, 0]));

    expect(collider.colliderType).toBe(ColliderType.Polygon);
    expect(collider.radius).toBeUndefined();
  });
});
