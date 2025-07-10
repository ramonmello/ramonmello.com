import { Component } from "@engine/core/base/Component";
import { Vector2 } from "@engine/core/components/TransformComponent";

export class ShipComponent extends Component {
  static readonly TYPE = "ship";

  get type(): string {
    return ShipComponent.TYPE;
  }

  shootCooldown: number = 10;

  lastShot: number = 0;

  thrustPower: number = 0.2;

  rotationSpeed: number = 0.1;

  thrusting: boolean = false;

  invincible: boolean = false;

  invincibilityTime: number = 0;

  trailPositions: { position: Vector2; rotation: number }[] = [];

  maxTrailLength: number = 5;

  constructor(
    shootCooldown: number = 10,
    thrustPower: number = 0.2,
    rotationSpeed: number = 0.1
  ) {
    super();
    this.shootCooldown = shootCooldown;
    this.thrustPower = thrustPower;
    this.rotationSpeed = rotationSpeed;
  }

  setInvincible(time: number): void {
    this.invincible = true;
    this.invincibilityTime = time;
  }

  // TODO: review this function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(deltaTime: number): void {
    if (this.lastShot > 0) {
      this.lastShot = Math.max(0, this.lastShot - 1);
    }

    if (this.invincible && this.invincibilityTime > 0) {
      this.invincibilityTime -= 1;
      if (this.invincibilityTime <= 0) {
        this.invincible = false;
      }
    }
  }

  canShoot(): boolean {
    return this.lastShot <= 0;
  }

  shoot(): void {
    this.lastShot = this.shootCooldown;
  }

  updateTrail(position: Vector2, rotation: number): void {
    this.trailPositions.unshift({
      position: { x: position.x, y: position.y },
      rotation,
    });

    if (this.trailPositions.length > this.maxTrailLength) {
      this.trailPositions.pop();
    }
  }
}
