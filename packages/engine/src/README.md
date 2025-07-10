# Engine 2D – v0.1.0-aplha.1 (Maio 2025)

**Uma engine 2D leve, modular e agnóstica de framework, escrita em TypeScript, com arquitetura ECS e Message Bus para criar experiências interativas em websites modernos**

---

## 🚀 O que é

- **ECS puro** (Entity-Component-System)  
- **Message Bus** para comunicação desacoplada  
- **Abstração** sobre APIs de navegador (sem `window`/`document` direto)  
- **WebGL 1.0** via `WebGLContext`  
- Integração pronta com **React**

---

## ✨ Principais Recursos

- **Loop principal** configurável  
- **Física básica**: AABB, gravidade, resposta elástica  
- **Colisão**: sistema independente (broad + narrowphase)  
- **Renderização 2D** por WebGL  
- **Input**: `KeyboardInputSystem` (teclado)  
- **Modularidade**: subsistemas substituíveis isoladamente  

---

## 🏗️ Arquitetura Essencial

1. **World**  
   - Orquestra Entities, Components e Systems  
2. **Entity**  
   - ID + conjunto de Components (dados puros)  
3. **Component**  
   - Estrutura de dados imutável em cada tick  
4. **System**  
   - Lógica executada em ordem de prioridade  
5. **Message Bus**  
   - Publish/subscribe de eventos entre Systems  

---

## 🔧 Componentes Core

| Componente            | Função                             |
| --------------------- | ---------------------------------- |
| **TransformComponent**| posição (`x`, `y`), rotação, escala|
| **PhysicsComponent**  | massa, velocidade, aceleração      |
| **ColliderComponent** | AABB, `isTrigger`                  |
| **RenderComponent**   | `textureId`, `zIndex`, `tint`      |

---

## 📦 Uso Básico (API)

```ts
// 1. Criar Entity + Components
const player = world.createEntity()
  .addComponent(TransformComponent, { x: 0, y: 0 })
  .addComponent(PhysicsComponent,   { mass: 1 })
  .addComponent(RenderComponent,    { textureId: "player" });

// 2. Registrar Systems com prioridade
world
  .addSystem(new PhysicsSystem(),   { priority: 10 })
  .addSystem(new CollisionSystem(), { priority: 20 })
  .addSystem(new RenderSystem(canvas), { priority: 30 });

// 3. Publicar evento
bus.publish({ type: "SpawnExplosion", payload: { x, y } });
