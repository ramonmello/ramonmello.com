import { Entity } from "@engine/core/base/Entity";
import { TransformComponent } from "@engine/core/components/TransformComponent";
import { RenderComponent } from "@engine/core/components/RenderComponent";
import { PhysicsComponent } from "@engine/core/components/PhysicsComponent";
import { ColliderComponent } from "@engine/core/components/ColliderComponent";
import { ShipComponent } from "../components/ShipComponent";
import { getWebGLContext } from "@engine/core/rendering/Context";

export function createShipEntity(): Entity {
  const { canvas } = getWebGLContext();

  const ship = new Entity("player_ship", "Player Ship");

  const transform = new TransformComponent(
    canvas.width / 2,
    canvas.height - 168, // bottom-14 (14 * 4 = 56px from bottom)
    Math.PI
  );

  const shipVertices = new Float32Array([0, 22.5, -7.5, -15, 7.5, -15]);

  const render = new RenderComponent(shipVertices);
  render.setColor(1, 1, 1, 1);

  const physics = new PhysicsComponent(0.98, true, 1, 10);

  const collider = ColliderComponent.createCircle(12);

  const player = new ShipComponent(10, 0.2, 0.1);

  ship
    .addComponent(transform)
    .addComponent(render)
    .addComponent(physics)
    .addComponent(collider)
    .addComponent(player);

  return ship;
}

export function createThrustEntity(shipEntity: Entity): Entity {
  const shipTransform = shipEntity.getComponent<TransformComponent>(
    TransformComponent.TYPE
  );

  if (!shipTransform) {
    throw new Error("Ship entity missing TransformComponent");
  }

  const thrust = new Entity("ship_thrust", "Ship Thrust Effect");

  const transform = new TransformComponent(
    shipTransform.position.x,
    shipTransform.position.y,
    shipTransform.rotation
  );

  const thrustVertices = new Float32Array([0, 12, -4, 18, 4, 18]);

  const render = new RenderComponent(thrustVertices);
  render.setColor(1, 0.7, 0.2, 0.8);

  thrust.addComponent(transform).addComponent(render);

  return thrust;
}
