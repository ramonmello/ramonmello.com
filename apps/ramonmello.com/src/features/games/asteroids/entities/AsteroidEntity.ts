import {
  Entity,
  TransformComponent,
  PhysicsComponent,
  RenderComponent,
  ColliderComponent,
  type CanvasSize,
} from "@engine/core";
import { AsteroidComponent } from "../components/AsteroidComponent";

function generateAsteroidVertices(size: number, points = 8): Float32Array {
  const verts: number[] = [];
  const step = (Math.PI * 2) / points;

  for (let i = 0; i < points; i++) {
    const angle = i * step;
    const radius = size * (0.8 + Math.random() * 0.4);
    verts.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  return new Float32Array(verts);
}

export function createAsteroidEntity(
  viewport: CanvasSize,
  size = 30
): Entity {
  // Position outside the screen (random side)
  const side = Math.floor(Math.random() * 4);
  let x = 0,
    y = 0;
  switch (side) {
    case 0:
      y = -size;
      x = Math.random() * viewport.width;
      break; // top
    case 1:
      x = viewport.width + size;
      y = Math.random() * viewport.height;
      break; // right
    case 2:
      y = viewport.height + size;
      x = Math.random() * viewport.width;
      break; // bottom
    case 3:
      x = -size;
      y = Math.random() * viewport.height;
      break; // left
  }

  const e = new Entity(`asteroid_${crypto.randomUUID()}`, "Asteroid");

  e.addComponent(new TransformComponent(x, y, Math.random() * Math.PI * 2));

  e.addComponent(new AsteroidComponent(size));

  /* Physics */
  // TODO: Verify if this work with 30 FPS (change to use deltaTime)
  const speed = 0.5 + Math.random(); // 0.5–1.5 px/frame
  const angle = Math.random() * Math.PI * 2;
  e.addComponent(
    new PhysicsComponent(
      /* friction */ 1,
      /* wrapAroundEdges */ true,
      /* mass */ 1,
      /* maxSpeed */ speed
    )
      .setAngularVelocity((Math.random() - 0.5) * 0.02)
      .setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)
  );

  /* Collider */
  const collider = ColliderComponent.createCircle(size);

  e.addComponent(collider);

  /* Render */
  e.addComponent(
    new RenderComponent(generateAsteroidVertices(size))
      .setColor(0.8, 0.8, 0.8, 1)
      .setDrawMode("line_loop")
  );

  return e;
}
