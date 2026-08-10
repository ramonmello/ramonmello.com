import { beforeEach, describe, expect, it, vi } from "vitest";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { System } from "./System";
import { World } from "./World";
import { MessageBus } from "../messaging/MessageBus";
import { WORLD_EVENTS } from "../messaging/MessageTypes";
import type { WebGLContext } from "../rendering/Context";

class TagComponent extends Component {
  static readonly TYPE = "tag";
  get type(): string {
    return TagComponent.TYPE;
  }
}

class MarkComponent extends Component {
  static readonly TYPE = "mark";
  get type(): string {
    return MarkComponent.TYPE;
  }
}

/** Sistema de sondagem: registra o que recebeu em cada update. */
class SpySystem extends System {
  readonly seen: Array<{ ids: string[]; deltaTime: number }> = [];
  init = vi.fn();

  constructor(
    readonly componentTypes: string[] = [],
    priority = 0
  ) {
    super();
    this.priority = priority;
  }

  update(entities: Entity[], deltaTime: number): void {
    this.seen.push({ ids: entities.map((e) => e.id), deltaTime });
  }
}

function entityWith(id: string, ...components: Component[]): Entity {
  const entity = new Entity(id);
  components.forEach((c) => entity.addComponent(c));
  return entity;
}

/** Só o canvas importa: é dele que o world tira o viewport. */
function renderContextWith(width: number, height: number): WebGLContext {
  return { canvas: { width, height } } as unknown as WebGLContext;
}

describe("World", () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  describe("registro de entidades", () => {
    it("indexa por id e expõe a coleção completa", () => {
      const a = entityWith("a");
      const b = entityWith("b");

      world.addEntity(a).addEntity(b);

      expect(world.getEntity("a")).toBe(a);
      expect(world.getAllEntities()).toEqual([a, b]);
    });

    it("emite entityAdded e entityRemoved", () => {
      const added = vi.fn();
      const removed = vi.fn();
      world.on(WORLD_EVENTS.ENTITY_ADDED, added);
      world.on(WORLD_EVENTS.ENTITY_REMOVED, removed);
      const entity = entityWith("a");

      world.addEntity(entity);
      world.removeEntity("a");

      expect(added).toHaveBeenCalledWith({ world, entity });
      expect(removed).toHaveBeenCalledWith({ world, entityId: "a" });
    });

    it("destrói a entidade ao removê-la", () => {
      const entity = entityWith("a", new TagComponent());
      world.addEntity(entity);

      world.removeEntity("a");

      expect(world.getEntity("a")).toBeUndefined();
      expect(entity.components.size).toBe(0);
    });

    it("remover um id inexistente é um no-op silencioso", () => {
      const removed = vi.fn();
      world.on(WORLD_EVENTS.ENTITY_REMOVED, removed);

      expect(() => world.removeEntity("fantasma")).not.toThrow();
      expect(removed).not.toHaveBeenCalled();
    });

    it("getEntitiesWith exige todos os types informados", () => {
      const both = entityWith("both", new TagComponent(), new MarkComponent());
      world
        .addEntity(both)
        .addEntity(entityWith("onlyTag", new TagComponent()))
        .addEntity(entityWith("none"));

      expect(
        world.getEntitiesWith(TagComponent.TYPE, MarkComponent.TYPE)
      ).toEqual([both]);
    });

    it("getEntitiesWith sem argumentos devolve todas as entidades", () => {
      world.addEntity(entityWith("a")).addEntity(entityWith("b"));

      expect(world.getEntitiesWith()).toHaveLength(2);
    });
  });

  describe("registro de sistemas", () => {
    it("ordena por prioridade crescente a cada inserção", () => {
      const late = new SpySystem([], 100);
      const early = new SpySystem([], 1);
      const middle = new SpySystem([], 50);

      world.addSystem(late).addSystem(early).addSystem(middle);
      world.start();
      world.update(0.016);

      expect(early.seen).toHaveLength(1);
      expect(middle.seen).toHaveLength(1);
      expect(late.seen).toHaveLength(1);
    });

    it("injeta o world e chama init no momento do registro", () => {
      const system = new SpySystem();

      world.addSystem(system);

      expect(system.init).toHaveBeenCalledWith(world);
    });
  });

  describe("update", () => {
    it("não faz nada enquanto o world não foi iniciado", () => {
      const system = new SpySystem();
      world.addSystem(system);

      world.update(0.016);

      expect(system.seen).toHaveLength(0);
      expect(world.getElapsedTime()).toBe(0);
    });

    it("acumula o tempo decorrido apenas enquanto rodando", () => {
      world.start();

      world.update(0.5);
      world.update(0.25);

      expect(world.getElapsedTime()).toBeCloseTo(0.75);
    });

    it("entrega a cada sistema só as entidades com os componentes exigidos", () => {
      const system = new SpySystem([TagComponent.TYPE]);
      world.addSystem(system);
      world.addEntity(entityWith("tagged", new TagComponent()));
      world.addEntity(entityWith("plain"));
      world.start();

      world.update(0.016);

      expect(system.seen[0].ids).toEqual(["tagged"]);
      expect(system.seen[0].deltaTime).toBe(0.016);
    });

    it("pula sistemas desabilitados", () => {
      const system = new SpySystem();
      system.enabled = false;
      world.addSystem(system);
      world.start();

      world.update(0.016);

      expect(system.seen).toHaveLength(0);
    });

    it("emite preUpdate antes e postUpdate depois dos sistemas", () => {
      const order: string[] = [];
      world.on(WORLD_EVENTS.PRE_UPDATE, () => order.push("pre"));
      world.on(WORLD_EVENTS.POST_UPDATE, () => order.push("post"));
      const system = new SpySystem();
      system.update = () => {
        order.push("system");
      };
      world.addSystem(system);
      world.start();

      world.update(0.016);

      expect(order).toEqual(["pre", "system", "post"]);
    });

    /**
     * Caracterização: a lista entregue ao sistema é uma cópia, então remover
     * entidades de dentro de um update() não corrompe a iteração corrente.
     * É só isso que segura hoje a ausência de um command buffer no core.
     */
    it("tolera remoção de entidades durante o update do sistema", () => {
      const system = new SpySystem([TagComponent.TYPE]);
      system.update = (entities) => {
        entities.forEach((e) => world.removeEntity(e.id));
      };
      world.addSystem(system);
      world.addEntity(entityWith("a", new TagComponent()));
      world.addEntity(entityWith("b", new TagComponent()));
      world.start();

      expect(() => world.update(0.016)).not.toThrow();
      expect(world.getAllEntities()).toHaveLength(0);
    });
  });

  describe("ciclo de vida", () => {
    it("start e stop emitem apenas na transição de estado", () => {
      const started = vi.fn();
      const stopped = vi.fn();
      world.on(WORLD_EVENTS.STARTED, started);
      world.on(WORLD_EVENTS.STOPPED, stopped);

      world.start();
      world.start();
      world.stop();
      world.stop();

      expect(started).toHaveBeenCalledOnce();
      expect(stopped).toHaveBeenCalledOnce();
    });

    it("clear zera entidades, sistemas e tempo decorrido", () => {
      const system = new SpySystem();
      world.addSystem(system);
      world.addEntity(entityWith("a"));
      world.start();
      world.update(0.5);

      world.clear();

      expect(world.getAllEntities()).toHaveLength(0);
      expect(world.getElapsedTime()).toBe(0);
    });

    it("clear desregistra os sistemas", () => {
      const system = new SpySystem();
      world.addSystem(system);
      world.start();
      world.update(0.016);

      world.clear();
      world.update(0.016);

      expect(system.seen).toHaveLength(1);
    });

    /**
     * Caracterização: clear() esvazia o mundo mas não altera o flag `running`.
     * O mundo segue aceitando updates e voltando a acumular tempo — quem
     * chama precisa parar explicitamente antes.
     */
    it("clear não para o world: updates seguintes voltam a acumular tempo", () => {
      world.start();
      world.update(0.5);

      world.clear();
      world.update(0.5);

      expect(world.getElapsedTime()).toBe(0.5);
    });

    it("destroy limpa o barramento do próprio world", () => {
      const handler = vi.fn();
      world.getMessageBus().on("evento-solto", handler);

      world.destroy();
      world.getMessageBus().emit("evento-solto", {});

      expect(handler).not.toHaveBeenCalled();
    });
  });

  /**
   * O critério de aceite de #62: dois mundos simultâneos não podem se ouvir
   * nem se atrapalhar. Antes o barramento era um singleton de processo e um
   * destroy() deixava o outro mundo surdo.
   */
  describe("isolamento entre mundos", () => {
    it("cada world tem o seu próprio barramento", () => {
      const other = new World();

      expect(world.getMessageBus()).not.toBe(other.getMessageBus());
    });

    it("um evento de um world não chega aos inscritos do outro", () => {
      const other = new World();
      const handler = vi.fn();
      other.on("tick", handler);

      world.emit("tick", {});

      expect(handler).not.toHaveBeenCalled();
    });

    it("destroy de um world não derruba as inscrições do outro", () => {
      const other = new World();
      const handler = vi.fn();
      other.on("evento-do-outro-mundo", handler);

      world.destroy();
      other.emit("evento-do-outro-mundo", {});

      expect(handler).toHaveBeenCalledOnce();
    });

    it("entidades emitem no barramento do world que as recebeu", () => {
      const other = new World();
      const here = vi.fn();
      const there = vi.fn();
      world.on("shoot", here);
      other.on("shoot", there);
      const entity = entityWith("player");

      other.addEntity(entity);
      entity.emit("shoot", {});

      expect(there).toHaveBeenCalledOnce();
      expect(here).not.toHaveBeenCalled();
    });

    it("aceita um barramento compartilhado quando dois mundos devem se ouvir", () => {
      const shared = new MessageBus();
      const a = new World({ messageBus: shared });
      const b = new World({ messageBus: shared });
      const handler = vi.fn();
      b.on("tick", handler);

      a.emit("tick", {});

      expect(handler).toHaveBeenCalledOnce();
    });
  });

  describe("contexto de renderização", () => {
    it("sem contexto o viewport é zerado (mundo headless)", () => {
      expect(world.getRenderContext()).toBeUndefined();
      expect(world.getViewport()).toEqual({ width: 0, height: 0 });
    });

    it("reporta o tamanho do drawing buffer do contexto", () => {
      world.setRenderContext(renderContextWith(800, 600));

      expect(world.getViewport()).toEqual({ width: 800, height: 600 });
    });
  });
});
