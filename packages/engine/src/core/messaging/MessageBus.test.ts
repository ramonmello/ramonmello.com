import { beforeEach, describe, expect, it, vi } from "vitest";
import { MessageBus } from "./MessageBus";

describe("MessageBus", () => {
  beforeEach(() => {
    MessageBus.getInstance().clearAllListeners();
  });

  it("é um singleton de processo", () => {
    expect(MessageBus.getInstance()).toBe(MessageBus.getInstance());
  });

  it("entrega o payload aos inscritos no tipo emitido", () => {
    const handler = vi.fn();
    MessageBus.getInstance().on("ping", handler);

    MessageBus.getInstance().emit("ping", { value: 42 });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ value: 42 });
  });

  it("emite com payload vazio quando nenhum dado é passado", () => {
    const handler = vi.fn();
    MessageBus.getInstance().on("ping", handler);

    MessageBus.getInstance().emit("ping");

    expect(handler).toHaveBeenCalledWith({});
  });

  it("não entrega a inscritos de outros tipos", () => {
    const handler = vi.fn();
    MessageBus.getInstance().on("ping", handler);

    MessageBus.getInstance().emit("pong", {});

    expect(handler).not.toHaveBeenCalled();
  });

  it("chama todos os handlers registrados no mesmo tipo", () => {
    const first = vi.fn();
    const second = vi.fn();
    MessageBus.getInstance().on("ping", first);
    MessageBus.getInstance().on("ping", second);

    MessageBus.getInstance().emit("ping", {});

    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });

  it("deduplica o mesmo handler registrado duas vezes (backing store é Set)", () => {
    const handler = vi.fn();
    MessageBus.getInstance().on("ping", handler);
    MessageBus.getInstance().on("ping", handler);

    MessageBus.getInstance().emit("ping", {});

    expect(handler).toHaveBeenCalledOnce();
  });

  it("o disposer retornado por on() remove apenas aquele handler", () => {
    const kept = vi.fn();
    const removed = vi.fn();
    MessageBus.getInstance().on("ping", kept);
    const dispose = MessageBus.getInstance().on("ping", removed);

    dispose();
    MessageBus.getInstance().emit("ping", {});

    expect(kept).toHaveBeenCalledOnce();
    expect(removed).not.toHaveBeenCalled();
  });

  it("descarta o bucket do tipo quando o último handler é removido", () => {
    const dispose = MessageBus.getInstance().on("ping", vi.fn());
    expect(MessageBus.getInstance().hasListeners("ping")).toBe(true);

    dispose();

    expect(MessageBus.getInstance().hasListeners("ping")).toBe(false);
  });

  it("clearListeners remove somente o tipo informado", () => {
    const ping = vi.fn();
    const pong = vi.fn();
    MessageBus.getInstance().on("ping", ping);
    MessageBus.getInstance().on("pong", pong);

    MessageBus.getInstance().clearListeners("ping");
    MessageBus.getInstance().emit("ping", {});
    MessageBus.getInstance().emit("pong", {});

    expect(ping).not.toHaveBeenCalled();
    expect(pong).toHaveBeenCalledOnce();
  });

  it("emitir um tipo sem inscritos é um no-op", () => {
    expect(() =>
      MessageBus.getInstance().emit("ninguem-escuta", {})
    ).not.toThrow();
  });

  /**
   * Caracterização de um risco conhecido: o barramento é global e não tem
   * escopo por World. Qualquer código que chame clearAllListeners() derruba
   * as inscrições de todos os mundos/jogos ativos ao mesmo tempo.
   * Ver World.destroy(), que faz exatamente isso.
   */
  it("clearAllListeners derruba as inscrições de todos os tipos (escopo global)", () => {
    const ping = vi.fn();
    const pong = vi.fn();
    MessageBus.getInstance().on("ping", ping);
    MessageBus.getInstance().on("pong", pong);

    MessageBus.getInstance().clearAllListeners();
    MessageBus.getInstance().emit("ping", {});
    MessageBus.getInstance().emit("pong", {});

    expect(ping).not.toHaveBeenCalled();
    expect(pong).not.toHaveBeenCalled();
  });
});
