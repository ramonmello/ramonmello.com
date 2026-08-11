import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Engine } from "./Engine";
import { BaseGame } from "./scaffold/BaseGame";
import type { GameConfig } from "./scaffold/Game";
import { System, SystemPhase } from "./core/base/System";
import { Entity } from "./core/base/Entity";
import { TransformComponent } from "./core/components/TransformComponent";
import { PhysicsComponent } from "./core/components/PhysicsComponent";
import { PhysicsSystem } from "./core/systems/PhysicsSystem";
import { FRAME_TIME, MAX_FRAME_TIME, TARGET_FPS } from "./core/config/time";
import type { InputSystem } from "./core/input/InputSystem";
import { GAME_EVENTS } from "./core/messaging/MessageTypes";

/**
 * Fake WebGL context, same shape the rendering code destructures. Answering
 * "ok" to every query is enough: no test here draws anything.
 */
function createFakeGL() {
  return {
    VERTEX_SHADER: 0x8b31,
    FRAGMENT_SHADER: 0x8b30,
    COMPILE_STATUS: 1,
    LINK_STATUS: 2,
    createShader: () => ({}),
    shaderSource: vi.fn(),
    compileShader: vi.fn(),
    getShaderParameter: () => true,
    getShaderInfoLog: () => "",
    createProgram: () => ({}),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: () => true,
    getProgramInfoLog: () => "",
    createBuffer: () => ({}),
    getAttribLocation: () => 0,
    getUniformLocation: () => ({}),
    viewport: vi.fn(),
  };
}

function createCanvas(clientWidth = 800, clientHeight = 600) {
  return {
    width: 0,
    height: 0,
    clientWidth,
    clientHeight,
    getContext: () => createFakeGL(),
  } as unknown as HTMLCanvasElement;
}

class SpySystem extends System {
  readonly componentTypes = [TransformComponent.TYPE];
  readonly seen: number[] = [];

  update(_entities: Entity[], deltaTime: number): void {
    this.seen.push(deltaTime);
  }
}

/** Registra o alpha de interpolação de cada passada do render. */
class SpyRenderSystem extends SpySystem {
  readonly phase: SystemPhase = "render";
  priority = 100;
}

class StubGame extends BaseGame {
  name = "Stub";
  description = "Jogo mínimo para exercitar a Engine";

  readonly spy = new SpySystem();
  readonly renderSpy = new SpyRenderSystem();
  createSystemsCalls = 0;

  protected getDefaultConfig(): GameConfig {
    return { debug: false };
  }

  protected createSystems(): void {
    this.createSystemsCalls += 1;
    this.world.addSystem(this.spy).addSystem(this.renderSpy);
  }

  protected createEntities(): void {
    const entity = new Entity("stub-entity");
    entity.addComponent(new TransformComponent(0, 0));
    this.world.addEntity(entity);
  }
}

/** Um corpo andando 10px por passo fixo, para medir o que a simulação andou. */
class BodyGame extends BaseGame {
  name = "Body";
  description = "Um corpo em movimento retilíneo uniforme";

  readonly transform = new TransformComponent(0, 0);

  protected getDefaultConfig(): GameConfig {
    return { debug: false };
  }

  protected createSystems(): void {
    this.world.addSystem(new PhysicsSystem());
  }

  protected createEntities(): void {
    const physics = new PhysicsComponent(1, false);
    physics.setVelocity(10, 0);
    const entity = new Entity("body");
    entity.addComponent(this.transform).addComponent(physics);
    this.world.addEntity(entity);
  }
}

const stubInput: InputSystem = {
  getDirection: () => ({ x: 0, y: 0 }),
  getActions: () => ({}),
  update: vi.fn(),
};

/** Driver de requestAnimationFrame: os frames só andam quando o teste manda. */
function createFrameLoop() {
  let nextId = 1;
  let pending = new Map<number, FrameRequestCallback>();
  let now = 0;

  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = nextId++;
    pending.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    pending.delete(id);
  });

  return {
    get scheduled() {
      return pending.size;
    },
    /** Roda um frame, avançando o relógio em `deltaMs`. */
    tick(deltaMs = 16) {
      now += deltaMs;
      const due = Array.from(pending.values());
      pending = new Map();
      due.forEach((callback) => callback(now));
    },
    /**
     * Primeiro frame de um run: sem frame anterior para medir, ele só acerta o
     * relógio da Engine. Nenhum passo de simulação sai daqui.
     */
    seed() {
      this.tick(0);
    },
  };
}

/** 0,105s: seis passos fixos e um resto de 0,3 de passo — longe das bordas. */
const SIX_STEPS_MS = 105;

describe("Engine", () => {
  let frames: ReturnType<typeof createFrameLoop>;

  beforeEach(() => {
    frames = createFrameLoop();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("liga o contexto do canvas ao world do jogo já na construção", () => {
    const game = new StubGame();
    const canvas = createCanvas(1024, 768);

    const engine = new Engine({ canvas, game });

    expect(game.getWorld().getRenderContext()).toBe(engine.getContext());
    expect(game.getWorld().getViewport()).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it("respeita canvasWidth/canvasHeight vindos da config", () => {
    const canvas = createCanvas(1920, 1080);

    const engine = new Engine({
      canvas,
      game: new StubGame(),
      config: { canvasWidth: 640, canvasHeight: 480 },
    });

    expect(engine.getWorld().getViewport()).toEqual({
      width: 640,
      height: 480,
    });
  });

  it("start inicializa o jogo e passa a rodar o world nos frames seguintes", async () => {
    const game = new StubGame();
    const engine = new Engine({ canvas: createCanvas(), game, input: stubInput });

    await engine.start();
    frames.seed();
    frames.tick(20);

    expect(game.isRunning()).toBe(true);
    expect(engine.isRunning()).toBe(true);
    expect(game.spy.seen).toHaveLength(1);
    expect(stubInput.update).toHaveBeenCalled();
  });

  it("start concorrente não inicializa o jogo duas vezes", async () => {
    const game = new StubGame();
    const engine = new Engine({ canvas: createCanvas(), game });

    await Promise.all([engine.start(), engine.start()]);

    expect(game.createSystemsCalls).toBe(1);
    expect(game.getWorld().getAllEntities()).toHaveLength(1);
  });

  it("pause interrompe os frames e resume os retoma", async () => {
    const game = new StubGame();
    const engine = new Engine({ canvas: createCanvas(), game });
    await engine.start();

    engine.pause();
    frames.tick(16);

    expect(engine.isRunning()).toBe(false);
    expect(frames.scheduled).toBe(0);
    expect(game.spy.seen).toHaveLength(0);

    engine.resume();
    frames.seed();
    frames.tick(20);

    expect(game.spy.seen).toHaveLength(1);
  });

  it("o tempo parado não vira simulação ao retomar", async () => {
    const game = new StubGame();
    const engine = new Engine({ canvas: createCanvas(), game });
    await engine.start();
    frames.seed();

    engine.pause();
    engine.resume();
    // O relógio andou dez segundos entre o pause e este frame; retomar zera o
    // acumulador, então nada disso é devido à simulação.
    frames.tick(10_000);

    expect(game.spy.seen).toHaveLength(0);
  });

  it("um start depois do pause apenas retoma, sem reinicializar", async () => {
    const game = new StubGame();
    const engine = new Engine({ canvas: createCanvas(), game });
    await engine.start();
    engine.pause();

    await engine.start();

    expect(game.createSystemsCalls).toBe(1);
    expect(engine.isRunning()).toBe(true);
  });

  it("destroy para o loop, destrói o world e recusa uso posterior", async () => {
    const game = new StubGame();
    const engine = new Engine({ canvas: createCanvas(), game });
    const stopped = vi.fn();
    game.getWorld().on(GAME_EVENTS.STOPPED, stopped);
    await engine.start();

    engine.destroy();
    frames.tick(16);

    expect(stopped).toHaveBeenCalledOnce();
    expect(engine.isRunning()).toBe(false);
    expect(frames.scheduled).toBe(0);
    expect(game.getWorld().getAllEntities()).toHaveLength(0);
    await expect(engine.start()).rejects.toThrow("destroyed");
  });

  it("setCanvas compila um contexto novo para o novo elemento", () => {
    const engine = new Engine({ canvas: createCanvas(), game: new StubGame() });
    const first = engine.getContext();
    const secondCanvas = createCanvas(320, 240);

    engine.setCanvas(secondCanvas);

    expect(engine.getContext()).not.toBe(first);
    expect(engine.getContext().canvas).toBe(secondCanvas);
    expect(engine.getWorld().getRenderContext()).toBe(engine.getContext());
  });

  /**
   * Critério de aceite de #63: a simulação anda em fatias de `FRAME_TIME`,
   * independentes da taxa de atualização da tela, e um frame longo é limitado
   * em vez de simulado inteiro.
   */
  describe("fixed timestep", () => {
    let game: StubGame;
    let engine: Engine;

    beforeEach(async () => {
      game = new StubGame();
      engine = new Engine({ canvas: createCanvas(), game });
      await engine.start();
      frames.seed();
    });

    it("o frame que abre o run só acerta o relógio", () => {
      expect(game.spy.seen).toHaveLength(0);
    });

    it("fatia o tempo do frame em passos de tamanho fixo", () => {
      frames.tick(SIX_STEPS_MS);

      expect(game.spy.seen).toHaveLength(6);
      expect(game.spy.seen.every((deltaTime) => deltaTime === FRAME_TIME)).toBe(
        true
      );
    });

    it("guarda o que sobra de um frame curto em vez de simulá-lo", () => {
      frames.tick(5);
      frames.tick(5);
      frames.tick(5);

      // 15ms ainda não fecham um passo de 16,67ms.
      expect(game.spy.seen).toHaveLength(0);

      frames.tick(5);

      expect(game.spy.seen).toHaveLength(1);
    });

    it("limita um frame de um segundo ao teto em vez de simular tudo", () => {
      frames.tick(1000);

      // 60 passos seriam a duração crua; o teto corta em 250ms.
      expect(game.spy.seen).toHaveLength(MAX_FRAME_TIME * TARGET_FPS);
    });

    it("desenha uma vez por frame, com o resto do acumulador como alpha", () => {
      frames.tick(SIX_STEPS_MS);

      expect(game.renderSpy.seen).toHaveLength(2);
      expect(game.renderSpy.seen[0]).toBe(0);
      expect(game.renderSpy.seen[1]).toBeCloseTo(0.3);
    });

    it("desenha também nos frames que não fecham nenhum passo", () => {
      frames.tick(5);

      expect(game.spy.seen).toHaveLength(0);
      expect(game.renderSpy.seen).toHaveLength(2);
    });
  });

  describe("determinismo", () => {
    async function runBody(drive: () => void): Promise<number> {
      const game = new BodyGame();
      await new Engine({ canvas: createCanvas(), game }).start();
      frames.seed();
      drive();
      return game.transform.position.x;
    }

    it("o mesmo tempo total chega ao mesmo lugar, seja qual for o corte em frames", async () => {
      const single = await runBody(() => frames.tick(205));

      frames = createFrameLoop();
      const split = await runBody(() => {
        frames.tick(100);
        frames.tick(105);
      });

      // 12 passos de 10px nos dois caminhos.
      expect(single).toBeCloseTo(120);
      expect(split).toBeCloseTo(single);
    });

    it("um frame de um segundo anda o teto, não o segundo inteiro", async () => {
      const clamped = await runBody(() => frames.tick(1000));

      expect(clamped).toBeCloseTo(MAX_FRAME_TIME * TARGET_FPS * 10);
      expect(clamped).toBeLessThan(TARGET_FPS * 10);
    });
  });

  /**
   * Critério de aceite de #62: dois jogos, dois canvas, na mesma página.
   * Antes o Manager, o MessageBus e o contexto WebGL eram únicos por processo.
   */
  describe("duas engines simultâneas", () => {
    it("cada uma roda o seu jogo, no seu canvas, no seu barramento", async () => {
      const gameA = new StubGame();
      const gameB = new StubGame();
      const canvasA = createCanvas(800, 600);
      const canvasB = createCanvas(400, 300);

      const a = new Engine({ canvas: canvasA, game: gameA });
      const b = new Engine({ canvas: canvasB, game: gameB });
      await a.start();
      await b.start();
      frames.seed();
      frames.tick(20);

      expect(a.getContext()).not.toBe(b.getContext());
      expect(gameA.getWorld().getMessageBus()).not.toBe(
        gameB.getWorld().getMessageBus()
      );
      expect(gameA.getWorld().getViewport()).toEqual({
        width: 800,
        height: 600,
      });
      expect(gameB.getWorld().getViewport()).toEqual({
        width: 400,
        height: 300,
      });
      expect(gameA.spy.seen).toHaveLength(1);
      expect(gameB.spy.seen).toHaveLength(1);
    });

    it("destruir uma não silencia nem congela a outra", async () => {
      const gameA = new StubGame();
      const gameB = new StubGame();
      const a = new Engine({ canvas: createCanvas(), game: gameA });
      const b = new Engine({ canvas: createCanvas(), game: gameB });
      await a.start();
      await b.start();

      frames.seed();

      const handler = vi.fn();
      gameB.getWorld().on("evento-de-b", handler);

      a.destroy();
      frames.tick(20);
      gameB.getWorld().emit("evento-de-b", {});

      expect(b.isRunning()).toBe(true);
      expect(gameB.spy.seen).toHaveLength(1);
      expect(gameA.spy.seen).toHaveLength(0);
      expect(handler).toHaveBeenCalledOnce();
    });
  });
});
