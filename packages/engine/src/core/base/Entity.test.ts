import { beforeEach, describe, expect, it, vi } from "vitest";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { MessageBus } from "../messaging/MessageBus";

class FakeComponent extends Component {
  static readonly TYPE = "fake";
  get type(): string {
    return FakeComponent.TYPE;
  }
  onAttach = vi.fn();
  onDetach = vi.fn();
}

class OtherComponent extends Component {
  static readonly TYPE = "other";
  get type(): string {
    return OtherComponent.TYPE;
  }
}

/** Entidade já ligada a um barramento, como sai de World.addEntity. */
function attached(bus: MessageBus, id?: string, name?: string): Entity {
  const entity = new Entity(id, name);
  entity.setMessageBus(bus);
  return entity;
}

describe("Entity", () => {
  let bus: MessageBus;

  beforeEach(() => {
    bus = new MessageBus();
  });

  describe("identidade", () => {
    it("gera um id quando nenhum é informado", () => {
      const a = new Entity();
      const b = new Entity();

      expect(a.id).toBeTruthy();
      expect(a.id).not.toBe(b.id);
    });

    it("respeita id e nome informados", () => {
      const entity = new Entity("player", "Player Ship");

      expect(entity.id).toBe("player");
      expect(entity.name).toBe("Player Ship");
    });
  });

  describe("componentes", () => {
    it("indexa o componente pelo seu type e liga a referência reversa", () => {
      const entity = new Entity();
      const component = new FakeComponent();

      entity.addComponent(component);

      expect(entity.hasComponent(FakeComponent.TYPE)).toBe(true);
      expect(entity.getComponent(FakeComponent.TYPE)).toBe(component);
      expect(component.entity).toBe(entity);
    });

    it("dispara onAttach ao anexar e onDetach ao remover", () => {
      const entity = new Entity();
      const component = new FakeComponent();

      entity.addComponent(component);
      expect(component.onAttach).toHaveBeenCalledOnce();

      entity.removeComponent(FakeComponent.TYPE);
      expect(component.onDetach).toHaveBeenCalledOnce();
    });

    it("permite encadear addComponent", () => {
      const entity = new Entity();

      const returned = entity
        .addComponent(new FakeComponent())
        .addComponent(new OtherComponent());

      expect(returned).toBe(entity);
      expect(entity.components.size).toBe(2);
    });

    /**
     * Caracterização: o registro é um Map indexado por type, então dois
     * componentes do mesmo tipo não coexistem — o segundo sobrescreve o
     * primeiro silenciosamente, sem disparar o onDetach do substituído.
     */
    it("sobrescreve silenciosamente um componente do mesmo type", () => {
      const entity = new Entity();
      const first = new FakeComponent();
      const second = new FakeComponent();

      entity.addComponent(first);
      entity.addComponent(second);

      expect(entity.getComponent(FakeComponent.TYPE)).toBe(second);
      expect(entity.components.size).toBe(1);
      expect(first.onDetach).not.toHaveBeenCalled();
      expect(first.entity).toBe(entity);
    });

    it("limpa a referência reversa ao remover", () => {
      const entity = new Entity();
      const component = new FakeComponent();
      entity.addComponent(component);

      expect(entity.removeComponent(FakeComponent.TYPE)).toBe(true);
      expect(component.entity).toBeUndefined();
      expect(entity.hasComponent(FakeComponent.TYPE)).toBe(false);
    });

    it("remover um type inexistente retorna false", () => {
      expect(new Entity().removeComponent("nao-existe")).toBe(false);
    });

    it("getComponent de um type ausente retorna undefined", () => {
      expect(new Entity().getComponent("nao-existe")).toBeUndefined();
    });
  });

  describe("mensageria", () => {
    it("injeta contexto da entidade no payload emitido", () => {
      const entity = attached(bus, "player", "Player Ship");
      const handler = vi.fn();
      bus.on("shoot", handler);

      entity.emit("shoot", { power: 3 });

      expect(handler).toHaveBeenCalledWith({
        entity,
        entityId: "player",
        entityName: "Player Ship",
        power: 3,
      });
    });

    /**
     * Caracterização: o payload do chamador é espalhado *depois* do contexto,
     * então uma chave `entity` no payload sobrescreve a entidade emissora.
     */
    it("o payload do chamador sobrescreve o contexto injetado", () => {
      const entity = attached(bus, "player");
      const impostor = new Entity("impostor");
      const handler = vi.fn();
      bus.on("shoot", handler);

      entity.emit("shoot", { entity: impostor });

      expect(handler.mock.calls[0][0].entity).toBe(impostor);
    });

    it("emitir sem barramento é um no-op", () => {
      expect(() => new Entity().emit("shoot", {})).not.toThrow();
    });

    it("registra no barramento as inscrições feitas antes do attach", () => {
      const entity = new Entity();
      const handler = vi.fn();
      entity.on("tick", handler);

      entity.setMessageBus(bus);
      bus.emit("tick", {});

      expect(handler).toHaveBeenCalledOnce();
    });

    it("migra as inscrições ao trocar de barramento", () => {
      const entity = attached(bus);
      const handler = vi.fn();
      entity.on("tick", handler);
      const other = new MessageBus();

      entity.setMessageBus(other);
      bus.emit("tick", {});
      other.emit("tick", {});

      expect(handler).toHaveBeenCalledOnce();
    });

    it("clearAllListeners descarta as inscrições feitas via on()", () => {
      const entity = attached(bus);
      const handler = vi.fn();
      entity.on("tick", handler);

      entity.clearAllListeners();
      bus.emit("tick", {});

      expect(handler).not.toHaveBeenCalled();
    });

    it("clearAllListeners não afeta inscrições de outras entidades", () => {
      const a = attached(bus);
      const b = attached(bus);
      const handlerB = vi.fn();
      a.on("tick", vi.fn());
      b.on("tick", handlerB);

      a.clearAllListeners();
      bus.emit("tick", {});

      expect(handlerB).toHaveBeenCalledOnce();
    });
  });

  describe("destroy", () => {
    it("remove todos os componentes, as inscrições e o barramento", () => {
      const entity = attached(bus);
      const component = new FakeComponent();
      const handler = vi.fn();
      entity.addComponent(component).addComponent(new OtherComponent());
      entity.on("tick", handler);

      entity.destroy();
      bus.emit("tick", {});

      expect(entity.components.size).toBe(0);
      expect(entity.getMessageBus()).toBeUndefined();
      expect(component.onDetach).toHaveBeenCalledOnce();
      expect(handler).not.toHaveBeenCalled();
    });

    it("é idempotente", () => {
      const entity = new Entity();
      entity.addComponent(new FakeComponent());

      entity.destroy();

      expect(() => entity.destroy()).not.toThrow();
    });
  });
});
