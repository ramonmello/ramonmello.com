import { beforeEach, describe, expect, it, vi } from "vitest";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { World } from "./World";
import { WORLD_EVENTS } from "../messaging/MessageTypes";

class TagComponent extends Component {
  static readonly TYPE = "tag";
  get type(): string {
    return TagComponent.TYPE;
  }
}

describe("CommandBuffer", () => {
  let world: World;

  beforeEach(() => {
    world = new World();
  });

  it("não muda nada enquanto não é drenado", () => {
    world.commands.spawn(new Entity("a"));

    expect(world.getEntity("a")).toBeUndefined();
    expect(world.commands.size).toBe(1);
  });

  it("spawn e destroy chegam ao mundo no flush", () => {
    world.addEntity(new Entity("velha"));
    world.commands.spawn(new Entity("nova"));
    world.commands.destroy("velha");

    world.commands.flush();

    expect(world.getEntity("nova")).toBeDefined();
    expect(world.getEntity("velha")).toBeUndefined();
    expect(world.commands.size).toBe(0);
  });

  it("aplica na ordem de enfileiramento", () => {
    const order: string[] = [];
    world.on(WORLD_EVENTS.ENTITY_ADDED, (data) =>
      order.push((data.entity as Entity).id)
    );

    world.commands.spawn(new Entity("primeira"));
    world.commands.spawn(new Entity("segunda"));
    world.commands.flush();

    expect(order).toEqual(["primeira", "segunda"]);
  });

  it("componente adicionado por comando chega na entidade certa", () => {
    world.addEntity(new Entity("a"));

    world.commands.addComponent("a", new TagComponent());
    world.commands.flush();

    expect(world.getEntity("a")?.hasComponent(TagComponent.TYPE)).toBe(true);
  });

  it("remove componente por comando", () => {
    const entity = new Entity("a");
    entity.addComponent(new TagComponent());
    world.addEntity(entity);

    world.commands.removeComponent("a", TagComponent.TYPE);
    world.commands.flush();

    expect(entity.hasComponent(TagComponent.TYPE)).toBe(false);
  });

  it("mutar componente de uma entidade que já morreu é no-op", () => {
    world.commands.addComponent("fantasma", new TagComponent());

    expect(() => world.commands.flush()).not.toThrow();
  });

  it("spawn seguido de addComponent funciona no mesmo lote", () => {
    world.commands.spawn(new Entity("a"));
    world.commands.addComponent("a", new TagComponent());

    world.commands.flush();

    expect(world.getEntity("a")?.hasComponent(TagComponent.TYPE)).toBe(true);
  });

  it("destroy repetido remove uma vez só", () => {
    const removed = vi.fn();
    world.addEntity(new Entity("a"));
    world.on(WORLD_EVENTS.ENTITY_REMOVED, removed);

    world.commands.destroy("a");
    world.commands.destroy("a");
    world.commands.flush();

    expect(removed).toHaveBeenCalledOnce();
  });

  it("isDestroying marca o id até o flush", () => {
    world.addEntity(new Entity("a"));

    world.commands.destroy("a");
    expect(world.commands.isDestroying("a")).toBe(true);

    world.commands.flush();
    expect(world.commands.isDestroying("a")).toBe(false);
  });

  /**
   * O flush leva o lote que existia quando começou: o que os próprios efeitos
   * enfileirarem fica para o passo seguinte, e uma reação em cadeia não vira
   * loop dentro de um único flush.
   */
  it("comando enfileirado durante o flush espera o próximo", () => {
    world.addEntity(new Entity("a"));
    world.on(WORLD_EVENTS.ENTITY_REMOVED, () => {
      if (world.getEntity("b")) world.commands.destroy("b");
    });
    world.addEntity(new Entity("b"));

    world.commands.destroy("a");
    world.commands.flush();

    expect(world.getEntity("b")).toBeDefined();
    expect(world.commands.size).toBe(1);

    world.commands.flush();

    expect(world.getEntity("b")).toBeUndefined();
  });

  it("clear joga fora o que estava enfileirado", () => {
    world.commands.spawn(new Entity("a"));

    world.commands.clear();
    world.commands.flush();

    expect(world.getEntity("a")).toBeUndefined();
  });

  it("flush vazio não emite nada", () => {
    const added = vi.fn();
    world.on(WORLD_EVENTS.ENTITY_ADDED, added);

    world.commands.flush();

    expect(added).not.toHaveBeenCalled();
  });
});
