import { Component, Entity } from "@engine/index";

export class ProjectileComponent extends Component {
  static readonly TYPE = "projectile";

  get type(): string {
    return ProjectileComponent.TYPE;
  }

  remainingTime: number;

  damage: number = 1;

  owner?: Entity;

  constructor(lifespan: number = 60, damage: number = 1, owner?: Entity) {
    super();
    this.remainingTime = lifespan;
    this.damage = damage;
    this.owner = owner;
  }

  update(dt: number): boolean {
    this.remainingTime -= dt;
    return this.remainingTime <= 0;
  }

  hasExpired(): boolean {
    return this.remainingTime <= 0;
  }
}
