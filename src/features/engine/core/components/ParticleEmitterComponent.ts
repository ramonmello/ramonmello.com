import { Component } from "../base/Component";
import { Particle, EmitterConfig } from "../rendering/particles";

export class ParticleEmitterComponent extends Component {
  static readonly TYPE = "particleEmitter";
  get type() {
    return ParticleEmitterComponent.TYPE;
  }

  particles: Particle[] = [];
  elapsed = 0;
  readonly maxLifetime: number;

  constructor(config: EmitterConfig) {
    super();
    this.maxLifetime = config.duration;
    for (let i = 0; i < config.num; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed =
        config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]);

      const size =
        config.size[0] + Math.random() * (config.size[1] - config.size[0]);

      this.particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size,
        life: 0,
        maxLife: this.maxLifetime,
      });
    }
  }
}
