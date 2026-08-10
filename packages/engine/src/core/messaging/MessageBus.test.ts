import { beforeEach, describe, expect, it, vi } from "vitest";
import { MessageBus } from "./MessageBus";

describe("MessageBus", () => {
  let bus: MessageBus;

  beforeEach(() => {
    bus = new MessageBus();
  });

  it("cada instância é um barramento independente", () => {
    const handler = vi.fn();
    bus.on("ping", handler);

    new MessageBus().emit("ping", {});

    expect(handler).not.toHaveBeenCalled();
  });

  it("entrega o payload aos inscritos no tipo emitido", () => {
    const handler = vi.fn();
    bus.on("ping", handler);

    bus.emit("ping", { value: 42 });

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith({ value: 42 });
  });

  it("emite com payload vazio quando nenhum dado é passado", () => {
    const handler = vi.fn();
    bus.on("ping", handler);

    bus.emit("ping");

    expect(handler).toHaveBeenCalledWith({});
  });

  it("não entrega a inscritos de outros tipos", () => {
    const handler = vi.fn();
    bus.on("ping", handler);

    bus.emit("pong", {});

    expect(handler).not.toHaveBeenCalled();
  });

  it("chama todos os handlers registrados no mesmo tipo", () => {
    const first = vi.fn();
    const second = vi.fn();
    bus.on("ping", first);
    bus.on("ping", second);

    bus.emit("ping", {});

    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });

  it("deduplica o mesmo handler registrado duas vezes (backing store é Set)", () => {
    const handler = vi.fn();
    bus.on("ping", handler);
    bus.on("ping", handler);

    bus.emit("ping", {});

    expect(handler).toHaveBeenCalledOnce();
  });

  it("o disposer retornado por on() remove apenas aquele handler", () => {
    const kept = vi.fn();
    const removed = vi.fn();
    bus.on("ping", kept);
    const dispose = bus.on("ping", removed);

    dispose();
    bus.emit("ping", {});

    expect(kept).toHaveBeenCalledOnce();
    expect(removed).not.toHaveBeenCalled();
  });

  it("descarta o bucket do tipo quando o último handler é removido", () => {
    const dispose = bus.on("ping", vi.fn());
    expect(bus.hasListeners("ping")).toBe(true);

    dispose();

    expect(bus.hasListeners("ping")).toBe(false);
  });

  it("clearListeners remove somente o tipo informado", () => {
    const ping = vi.fn();
    const pong = vi.fn();
    bus.on("ping", ping);
    bus.on("pong", pong);

    bus.clearListeners("ping");
    bus.emit("ping", {});
    bus.emit("pong", {});

    expect(ping).not.toHaveBeenCalled();
    expect(pong).toHaveBeenCalledOnce();
  });

  it("emitir um tipo sem inscritos é um no-op", () => {
    expect(() => bus.emit("ninguem-escuta", {})).not.toThrow();
  });

  it("clearAllListeners derruba todos os tipos deste barramento", () => {
    const ping = vi.fn();
    const pong = vi.fn();
    bus.on("ping", ping);
    bus.on("pong", pong);

    bus.clearAllListeners();
    bus.emit("ping", {});
    bus.emit("pong", {});

    expect(ping).not.toHaveBeenCalled();
    expect(pong).not.toHaveBeenCalled();
  });

  it("clearAllListeners não alcança as inscrições de outro barramento", () => {
    const other = new MessageBus();
    const handler = vi.fn();
    other.on("ping", handler);

    bus.clearAllListeners();
    other.emit("ping", {});

    expect(handler).toHaveBeenCalledOnce();
  });
});
