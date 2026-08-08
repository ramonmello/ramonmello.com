import { beforeEach, describe, expect, it, vi } from "vitest";
import { BaseGame } from "./BaseGame";
import type { GameConfig } from "./Game";
import { World } from "../core/base/World";
import { MessageBus } from "../core/messaging/MessageBus";
import { GAME_EVENTS } from "../core/messaging/MessageTypes";
import type { InputSystem } from "../core/input/InputSystem";

class StubGame extends BaseGame {
  name = "Stub";
  description = "Jogo mínimo para exercitar o scaffold";

  createSystems = vi.fn();
  createEntities = vi.fn();

  protected getDefaultConfig(): GameConfig {
    return { canvasWidth: 800, canvasHeight: 600, debug: false };
  }
}

const stubInput: InputSystem = {
  getDirection: () => ({ x: 0, y: 0 }),
  getActions: () => ({}),
  update: () => {},
};

describe("BaseGame", () => {
  let game: StubGame;

  beforeEach(() => {
    MessageBus.getInstance().clearAllListeners();
    game = new StubGame();
  });

  describe("construção", () => {
    it("já nasce com um World próprio e a config padrão", () => {
      expect(game.getWorld()).toBeInstanceOf(World);
      expect(game.getConfig()).toEqual({
        canvasWidth: 800,
        canvasHeight: 600,
        debug: false,
      });
    });

    it("não está inicializado nem rodando antes de initialize", () => {
      expect(game.isInitialized()).toBe(false);
      expect(game.isRunning()).toBe(false);
    });
  });

  describe("initialize", () => {
    it("monta sistemas e entidades, nessa ordem", async () => {
      await game.initialize();

      expect(game.createSystems).toHaveBeenCalledOnce();
      expect(game.createEntities).toHaveBeenCalledOnce();
      expect(
        game.createSystems.mock.invocationCallOrder[0]
      ).toBeLessThan(game.createEntities.mock.invocationCallOrder[0]);
      expect(game.isInitialized()).toBe(true);
    });

    it("mescla a config parcial sobre a padrão", async () => {
      await game.initialize(undefined, { canvasWidth: 1920, debug: true });

      expect(game.getConfig()).toEqual({
        canvasWidth: 1920,
        canvasHeight: 600,
        debug: true,
      });
    });

    it("adota o World recebido no lugar do próprio", async () => {
      const external = new World();

      await game.initialize(external);

      expect(game.getWorld()).toBe(external);
    });

    it("emite gameInitialized com referência ao jogo", async () => {
      const handler = vi.fn();
      game.getWorld().on(GAME_EVENTS.INITIALIZED, handler);

      await game.initialize();

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({ game })
      );
    });
  });

  describe("ciclo de vida", () => {
    it("start antes de initialize é um erro", () => {
      expect(() => game.start()).toThrow(/não foi inicializado/);
    });

    it("start coloca o world para rodar e emite gameStarted", async () => {
      const handler = vi.fn();
      await game.initialize();
      game.getWorld().on(GAME_EVENTS.STARTED, handler);

      game.start();

      expect(game.isRunning()).toBe(true);
      expect(handler).toHaveBeenCalledOnce();
    });

    it("pause interrompe o world e emite gamePaused", async () => {
      const handler = vi.fn();
      await game.initialize();
      game.start();
      game.getWorld().on(GAME_EVENTS.PAUSED, handler);

      game.pause();

      expect(game.isRunning()).toBe(false);
      expect(handler).toHaveBeenCalledOnce();
    });

    it("pause em jogo já pausado é um no-op", async () => {
      const handler = vi.fn();
      await game.initialize();
      game.getWorld().on(GAME_EVENTS.PAUSED, handler);

      game.pause();

      expect(handler).not.toHaveBeenCalled();
    });

    it("resume volta a rodar e emite gameResumed", async () => {
      const handler = vi.fn();
      await game.initialize();
      game.start();
      game.pause();
      game.getWorld().on(GAME_EVENTS.RESUMED, handler);

      game.resume();

      expect(game.isRunning()).toBe(true);
      expect(handler).toHaveBeenCalledOnce();
    });

    it("resume não faz nada se o jogo nunca foi inicializado", () => {
      const handler = vi.fn();
      game.getWorld().on(GAME_EVENTS.RESUMED, handler);

      game.resume();

      expect(game.isRunning()).toBe(false);
      expect(handler).not.toHaveBeenCalled();
    });

    it("stop encerra e emite gameStopped", async () => {
      const handler = vi.fn();
      await game.initialize();
      game.start();
      game.getWorld().on(GAME_EVENTS.STOPPED, handler);

      game.stop();

      expect(game.isRunning()).toBe(false);
      expect(handler).toHaveBeenCalledOnce();
    });

    it("restart limpa o world e remonta sistemas e entidades", async () => {
      await game.initialize();
      game.start();

      await game.restart();

      expect(game.createSystems).toHaveBeenCalledTimes(2);
      expect(game.createEntities).toHaveBeenCalledTimes(2);
      expect(game.isRunning()).toBe(true);
    });
  });

  describe("input", () => {
    it("guarda e devolve o InputSystem injetado", () => {
      expect(game.getInputSystem()).toBeUndefined();

      game.setInputSystem(stubInput);

      expect(game.getInputSystem()).toBe(stubInput);
    });
  });
});
