import { beforeEach, describe, expect, it } from "vitest";
import { Entity } from "../base/Entity";
import { World } from "../base/World";
import { ParticleEmitterComponent } from "../components/ParticleEmitterComponent";
import { TransformComponent } from "../components/TransformComponent";
import type { EmitterConfig } from "../rendering/particles";
import { ParticleSystem } from "./ParticleSystem";

const CONFIG: EmitterConfig = {
  num: 4,
  speed: [1, 1],
  size: [2, 2],
  duration: 1,
};

function makeEmitter(config: EmitterConfig = CONFIG): {
  entity: Entity;
  emitter: ParticleEmitterComponent;
} {
  const entity = new Entity();
  const emitter = new ParticleEmitterComponent(config);
  entity.addComponent(new TransformComponent(0, 0)).addComponent(emitter);
  return { entity, emitter };
}

describe("ParticleEmitterComponent", () => {
  it("pré-aloca a quantidade de partículas pedida", () => {
    const { emitter } = makeEmitter();

    expect(emitter.particles).toHaveLength(CONFIG.num);
    expect(emitter.maxLifetime).toBe(CONFIG.duration);
  });

  it("distribui as partículas dentro das faixas de velocidade e tamanho", () => {
    const { emitter } = makeEmitter({
      num: 50,
      speed: [2, 4],
      size: [1, 3],
      duration: 1,
    });

    for (const particle of emitter.particles) {
      const speed = Math.hypot(particle.vx, particle.vy);
      expect(speed).toBeGreaterThanOrEqual(2);
      expect(speed).toBeLessThanOrEqual(4);
      expect(particle.size).toBeGreaterThanOrEqual(1);
      expect(particle.size).toBeLessThanOrEqual(3);
      expect(particle.life).toBe(0);
    }
  });

  it("nasce com todas as partículas na origem local do emissor", () => {
    const { emitter } = makeEmitter();

    for (const particle of emitter.particles) {
      expect(particle.x).toBe(0);
      expect(particle.y).toBe(0);
    }
  });
});

describe("ParticleSystem", () => {
  let system: ParticleSystem;
  let world: World;

  beforeEach(() => {
    world = new World();
    system = new ParticleSystem();
    system.setWorld(world);
  });

  it("acumula o tempo de vida do emissor e de cada partícula", () => {
    const { entity, emitter } = makeEmitter();
    world.addEntity(entity);

    system.update([entity], 0.1);

    expect(emitter.elapsed).toBeCloseTo(0.1);
    expect(emitter.particles[0].life).toBeCloseTo(0.1);
  });

  it("amortece a velocidade das partículas em 5% por frame", () => {
    const { entity, emitter } = makeEmitter();
    const before = emitter.particles[0].vx;
    world.addEntity(entity);

    system.update([entity], 0.016);

    expect(emitter.particles[0].vx).toBeCloseTo(before * 0.95);
  });

  it("descarta partículas que passaram do maxLife", () => {
    const { entity, emitter } = makeEmitter();
    world.addEntity(entity);

    system.update([entity], 1.5);

    expect(emitter.particles).toHaveLength(0);
  });

  it("remove a entidade quando o emissor expira e não sobra partícula", () => {
    const { entity } = makeEmitter();
    world.addEntity(entity);

    system.update([entity], 1.5);
    world.commands.flush();

    expect(world.getEntity(entity.id)).toBeUndefined();
  });

  it("enfileira a remoção em vez de mexer no mundo durante o update", () => {
    const { entity } = makeEmitter();
    world.addEntity(entity);

    system.update([entity], 1.5);

    expect(world.getEntity(entity.id)).toBe(entity);
    expect(world.commands.size).toBe(1);
  });

  it("mantém a entidade enquanto houver partícula viva", () => {
    const { entity } = makeEmitter();
    world.addEntity(entity);

    system.update([entity], 0.5);
    world.commands.flush();

    expect(world.getEntity(entity.id)).toBe(entity);
  });

  /**
   * Caracterização de uma inconsistência conhecida: o avanço de posição das
   * partículas soma `vx`/`vy` direto, sem multiplicar por deltaTime — ao
   * contrário do PhysicsSystem, que escala tudo por `dt * TARGET_FPS`.
   * Na prática as partículas andam por frame renderizado, não por segundo.
   */
  it("caracterização: a posição da partícula ignora o deltaTime", () => {
    const { entity, emitter } = makeEmitter();
    const velocity = emitter.particles[0].vx;
    world.addEntity(entity);

    system.update([entity], 0.001);

    expect(emitter.particles[0].x).toBeCloseTo(velocity);
  });
});
