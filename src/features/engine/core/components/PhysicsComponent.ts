import { Component } from "../base/Component";
import { Vector2 } from "./TransformComponent";

export class PhysicsComponent extends Component {
  static readonly TYPE = "physics";

  get type(): string {
    return PhysicsComponent.TYPE;
  }

  velocity: Vector2;

  acceleration: Vector2;

  angularVelocity: number;

  friction: number;

  wrapAroundEdges: boolean;

  mass: number;

  maxSpeed?: number;

  constructor(
    friction: number = 0.99,
    wrapAroundEdges: boolean = true,
    mass: number = 1,
    maxSpeed?: number
  ) {
    super();
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.angularVelocity = 0;
    this.friction = friction;
    this.wrapAroundEdges = wrapAroundEdges;
    this.mass = mass;
    this.maxSpeed = maxSpeed;
  }

  setVelocity(x: number, y: number): PhysicsComponent {
    this.velocity.x = x;
    this.velocity.y = y;
    this.applySpeedLimit();
    return this;
  }

  setAcceleration(x: number, y: number): PhysicsComponent {
    this.acceleration.x = x;
    this.acceleration.y = y;
    return this;
  }

  setAngularVelocity(angularVelocity: number): PhysicsComponent {
    this.angularVelocity = angularVelocity;
    return this;
  }

  setFriction(friction: number): PhysicsComponent {
    this.friction = friction;
    return this;
  }

  setWrapAroundEdges(wrap: boolean): PhysicsComponent {
    this.wrapAroundEdges = wrap;
    return this;
  }

  setMass(mass: number): PhysicsComponent {
    this.mass = mass;
    return this;
  }

  setMaxSpeed(maxSpeed?: number): PhysicsComponent {
    this.maxSpeed = maxSpeed;
    this.applySpeedLimit();
    return this;
  }

  applyForce(forceX: number, forceY: number): PhysicsComponent {
    this.acceleration.x += forceX / this.mass;
    this.acceleration.y += forceY / this.mass;
    return this;
  }

  applyImpulse(impulseX: number, impulseY: number): PhysicsComponent {
    this.velocity.x += impulseX / this.mass;
    this.velocity.y += impulseY / this.mass;
    this.applySpeedLimit();
    return this;
  }

  private applySpeedLimit(): void {
    if (this.maxSpeed !== undefined) {
      const currentSpeed = Math.hypot(this.velocity.x, this.velocity.y);
      if (currentSpeed > this.maxSpeed) {
        const scaleFactor = this.maxSpeed / currentSpeed;
        this.velocity.x *= scaleFactor;
        this.velocity.y *= scaleFactor;
      }
    }
  }
}
