# @engine/core

Engine 2D em TypeScript, com arquitetura ECS, message bus e renderização WebGL
1.0. Nasceu para o minigame do [ramonmello.com](../../apps/ramonmello.com) e
ainda mora neste monorepo: a versão é `0.0.1`, o pacote é privado e a API muda
sem aviso.

A engine não conhece a página em volta. Ela recebe um `<canvas>` e um objeto que
informa o estado do teclado; não registra listeners, não lê `window`/`document` e
não busca nada por HTTP — inclusive os shaders são strings embutidas no bundle.
Isso mantém o pacote independente de framework (React só aparece no app, nunca
aqui).

## Índice

- [Instalação](#instalação)
- [Conceitos](#conceitos)
- [Uso básico](#uso-básico)
- [Referência](#referência)
- [Limitações conhecidas](#limitações-conhecidas)
- [Desenvolvimento](#desenvolvimento)

## Instalação

Dentro do monorepo, via workspace:

```jsonc
// package.json do app
{
  "dependencies": {
    "@engine/core": "workspace:*"
  }
}
```

O app consome sempre o build (`dist`), nunca o `src` por path relativo — então
depois de mexer na engine é preciso rodar `pnpm --filter @engine/core build`
antes do `typecheck` do app.

Tudo é exportado pelo barrel raiz:

```ts
import { World, Entity, System, TransformComponent } from "@engine/core";
```

## Conceitos

| Peça             | Papel                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| **Entity**       | Um `id` (UUID por padrão), um `name` opcional e um `Map` de componentes indexado por `type`.                 |
| **Component**    | Só dados. Cada classe expõe um `type` (string) e um `static TYPE` usado para buscar e declarar dependências. |
| **System**       | Só lógica. Declara `componentTypes`, tem `priority` (menor roda antes) e um `enabled`.                       |
| **World**        | Guarda entidades e sistemas. A cada `update(deltaTime)` roda os sistemas em ordem de prioridade, passando para cada um apenas as entidades que têm todos os `componentTypes` exigidos. |
| **MessageBus**   | Publish/subscribe global por string. `World` e `Entity` têm `emit`/`on` que delegam para ele.                |

O `World` não roda sozinho: alguém precisa chamar `update` a cada frame. Quem faz
isso por você é o `Manager` (ver [Uso básico](#uso-básico)).

## Uso básico

### 1. ECS puro

Este trecho roda em qualquer lugar, inclusive em Node — não depende de canvas:

```ts
import { Entity, System, TransformComponent, World } from "@engine/core";

class SpinSystem extends System {
  readonly componentTypes = [TransformComponent.TYPE];

  priority = 10;

  update(entities: Entity[], deltaTime: number): void {
    for (const entity of entities) {
      const transform = entity.getComponent<TransformComponent>(
        TransformComponent.TYPE
      );
      transform?.rotate(Math.PI * deltaTime);
    }
  }
}

const world = new World();
world.addSystem(new SpinSystem());

const player = new Entity("player", "Player");
player.addComponent(new TransformComponent(100, 100));
world.addEntity(player);

world.start();
world.update(1 / 60);
```

Componentes são instanciados e passados prontos (`new TransformComponent(x, y)`),
e `addComponent` devolve a entidade, então dá para encadear. Sistemas são
instâncias; a prioridade é um campo da classe, não um argumento de `addSystem`.

### 2. Um jogo completo

`BaseGame` cobre o ciclo de vida (`initialize` → `start`/`pause`/`resume`/`stop`
→ `restart`) e só pede duas coisas: os sistemas e as entidades iniciais.

```ts
import {
  BaseGame,
  ColliderComponent,
  CollisionSystem,
  Entity,
  GameConfig,
  PhysicsComponent,
  PhysicsSystem,
  RenderComponent,
  RenderSystem,
  TransformComponent,
} from "@engine/core";

class DriftingBalls extends BaseGame {
  name = "Drifting Balls";

  description = "Bolas à deriva num canvas de 800x600";

  protected getDefaultConfig(): GameConfig {
    return { canvasWidth: 800, canvasHeight: 600 };
  }

  protected createSystems(): void {
    this.world.addSystem(new PhysicsSystem());
    this.world.addSystem(new CollisionSystem());
    this.world.addSystem(new RenderSystem(true, [0, 0, 0, 1]));
  }

  protected createEntities(): void {
    for (let i = 0; i < 8; i++) {
      const ball = new Entity();
      const physics = new PhysicsComponent(1, true, 1, 6);
      physics.setVelocity(Math.random() * 4 - 2, Math.random() * 4 - 2);

      ball
        .addComponent(new TransformComponent(400, 300))
        .addComponent(physics)
        .addComponent(ColliderComponent.createCircle(8))
        .addComponent(RenderComponent.createCircle(8));

      this.world.addEntity(ball);
    }
  }
}
```

`canvasWidth`/`canvasHeight` só valem juntos: com os dois, o buffer de desenho
fica travado nesse tamanho; sem eles, o canvas segue o próprio tamanho de layout
(via `ResizeObserver`).

### 3. Ligando no host

O `Manager` é quem cria o contexto WebGL e roda o loop de
`requestAnimationFrame`. O input precisa ser configurado **antes** do
`startGame`, senão ele lança:

```ts
import { KeyboardHandler, Manager } from "@engine/core";

export async function mount(canvas: HTMLCanvasElement) {
  const pressed: Record<string, boolean> = {};
  window.addEventListener("keydown", (e) => (pressed[e.code] = true));
  window.addEventListener("keyup", (e) => (pressed[e.code] = false));

  const keyboard: KeyboardHandler = { getState: () => ({ ...pressed }) };

  const manager = Manager.getInstance();
  manager.setInputHandler(keyboard);

  // Devolve uma função que pausa o jogo — útil no cleanup do host.
  return manager.startGame(new DriftingBalls(), canvas);
}
```

Dentro dos sistemas, o estado do teclado chega normalizado pelo
`KeyboardInputSystem`: `getDirection()` devolve `{ x, y }` a partir das setas e
`getActions()` devolve `{ fire, boost }` (Space e Shift).

Um exemplo real dessa ligação está em
[`GameWrapper.tsx`](../../apps/ramonmello.com/src/features/home/ui/GameWrapper.tsx),
e o jogo inteiro em
[`features/games/asteroids`](../../apps/ramonmello.com/src/features/games/asteroids).

### 4. Reagindo a eventos

Colisão não é resolvida pela engine: ela detecta e avisa. Quem decide o que
acontece é o jogo.

```ts
import { COLLISION_EVENTS, Entity, MessageBus, World } from "@engine/core";

const unsubscribe = MessageBus.getInstance().on(
  COLLISION_EVENTS.DETECT,
  (data) => {
    const { entityA, entityB, world } = data as {
      entityA: Entity;
      entityB: Entity;
      world: World;
    };

    world.removeEntity(entityB.id);
    entityA.emit("scoreChanged", { points: 100 });
  }
);

unsubscribe();
```

O cast é necessário: o payload trafega como `Record<string, unknown>`.

### 5. Contexto WebGL e shaders

Normalmente o `Manager` cuida disso, mas o contexto pode ser criado na mão —
útil em testes ou para rodar só o `RenderSystem`:

```ts
import { fixedCanvasSize, initWebGLContext } from "@engine/core";

export function setup(canvas: HTMLCanvasElement) {
  initWebGLContext(canvas, {
    size: fixedCanvasSize(800, 600),
    fragmentShader: `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = vec4(u_color.rgb * 0.5, u_color.a);
}
`,
  });
}
```

Os shaders são compilados só na criação do contexto; para trocá-los depois é
preciso chamar `clearWebGLContext()` antes. Pelo `Manager`, o equivalente é
`manager.setShaders({ ... })` antes do `startGame`. Qualquer shader próprio
precisa manter o atributo `a_position` e os uniforms `u_resolution`,
`u_translation`, `u_rotation` e `u_color`, que é o que os sistemas de render
alimentam.

## Referência

### Componentes

| Componente                  | `TYPE`            | Dados                                                                                    |
| --------------------------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `TransformComponent`        | `transform`       | `position {x,y}`, `rotation` (radianos), `scale {x,y}`                                     |
| `PhysicsComponent`          | `physics`         | `velocity`, `acceleration`, `angularVelocity`, `friction`, `wrapAroundEdges`, `mass`, `maxSpeed?` |
| `ColliderComponent`         | `collider`        | forma (círculo, retângulo ou polígono), `offset`, `tags`, `layer`/`mask`, `active`, `isTrigger` |
| `RenderComponent`           | `render`          | `vertices` (`Float32Array`), `color` RGBA em 0–1, `visible`, `zIndex`, `drawMode`           |
| `ParticleEmitterComponent`  | `particleEmitter` | `particles`, `elapsed`, `maxLifetime`                                                      |

`ColliderComponent` e `RenderComponent` têm fábricas estáticas:
`ColliderComponent.createCircle/createRectangle/createPolygon` e
`RenderComponent.createCircle/createRectangle/createTriangle`. Não há texturas —
o `RenderComponent` desenha geometria com uma cor sólida.

### Sistemas

| Sistema                | `priority` | Requer                       | O que faz                                                                                                                    |
| ---------------------- | ---------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `PhysicsSystem`        | 10         | transform + physics          | Integra aceleração → velocidade → posição, aplica `friction` (exponencial), corta em `maxSpeed`, gira por `angularVelocity` e faz wrap nas bordas do canvas quando `wrapAroundEdges`. |
| `ParticleSystem`       | 15         | transform + particleEmitter  | Avança as partículas, descarta as expiradas e remove a entidade quando o emissor termina.                                      |
| `CollisionSystem`      | 50         | transform + collider         | Testa todos os pares e emite `collision.detect`; se nenhum dos dois for `isTrigger`, emite também `collision.resolve`.          |
| `RenderSystem`         | 100        | transform + render           | Limpa a tela (opcional), ordena por `zIndex` e desenha cada entidade com o `drawMode` escolhido.                               |
| `EmitterRenderSystem`  | 110        | transform + particleEmitter  | Desenha cada partícula como um quad, com alpha decaindo pela vida.                                                             |

Prioridade menor roda antes. Sistemas do jogo entram na mesma escala — no
Asteroids, o controle da nave usa `priority = 1` para rodar antes da física.

### Rendering

- `initWebGLContext(canvas, options?)` — cria (ou reaproveita) o contexto global.
- `getWebGLContext()` — recupera o contexto; lança se não houver um.
- `clearWebGLContext()` — descarta o contexto e solta o `ResizeObserver`.
- `elementCanvasSize()` — o buffer segue o tamanho de layout do elemento
  (padrão); `fixedCanvasSize(w, h)` — trava num tamanho fixo.
- `DEFAULT_VERTEX_SHADER` / `DEFAULT_FRAGMENT_SHADER` — os shaders embutidos.

### Messaging

`MessageBus.getInstance()` expõe `on` (devolve o disposer), `emit`,
`clearListeners`, `clearAllListeners` e `hasListeners`. As constantes de evento
ficam em `MessageTypes`: `WORLD_EVENTS`, `COLLISION_EVENTS`, `PLAYER_EVENTS`,
`GAME_EVENTS`, `PROJECTILE_EVENTS`, `ENTITY_EVENTS` e `MESSAGE_TYPES`.

### Input

`InputSystem` é a interface (`getDirection`, `getActions`, `update`) e
`KeyboardInputSystem` a implementação de teclado, que lê de um `KeyboardHandler`
fornecido pelo host — quem escuta os eventos do DOM é o host, não a engine.

### Scaffold

`Game` (interface), `BaseGame` (implementação abstrata) e `Manager` (singleton
com o loop, o contexto e o input).

## Limitações conhecidas

A engine é um projeto em andamento; o que ela **não** faz hoje:

- **Física é cinemática.** Não há gravidade nem resposta de colisão. O evento
  `collision.resolve` só avisa que dois corpos sólidos se tocaram — separar ou
  rebater é responsabilidade do jogo.
- **Velocidades são "por frame a 60fps".** `PhysicsSystem` multiplica tudo por
  `deltaTime * TARGET_FPS`, e o delta não é clampado: uma aba que volta do
  segundo plano gera um passo gigante e teleporta as entidades.
- **`PhysicsSystem` depende do contexto WebGL**, de onde tira as dimensões do
  canvas para o wrap — mesmo num mundo sem render.
- **Colisão é O(n²)** e sem broadphase. `ColliderType.Polygon` existe no enum mas
  não tem teste próprio: cai num círculo aproximado.
- **Um draw call por entidade** (e por partícula, no `EmitterRenderSystem`). Não
  há batching, instancing nem atlas.
- **`ParticleSystem` ignora `deltaTime`** no deslocamento das partículas; só a
  vida usa dt.
- **Estado global.** `Manager`, `MessageBus` e o contexto WebGL são singletons —
  dois jogos no mesmo documento não são suportados.
- **Eventos não são tipados**: o payload é `Record<string, unknown>` e cabe ao
  consumidor fazer o cast.

APIs de navegador realmente usadas: canvas + WebGL 1.0, `ResizeObserver`,
`requestAnimationFrame`, `performance.now()` e `crypto.randomUUID()`. Nada de
`window`, `document` ou storage — há um teste (`src/browserGlobals.test.ts`) que
falha se algum módulo passar a referenciá-los.

## Desenvolvimento

```bash
pnpm --filter @engine/core build          # tsup: CJS + ESM + .d.ts em dist/
pnpm --filter @engine/core test           # vitest (ambiente node)
pnpm --filter @engine/core test:coverage
pnpm --filter @engine/core typecheck      # tsc --noEmit
```

Estrutura do `src`:

```
src/
├── core/
│   ├── base/         # Entity, Component, System, World
│   ├── components/   # componentes prontos
│   ├── config/       # TARGET_FPS, FRAME_TIME
│   ├── input/        # InputSystem, KeyboardInputSystem
│   ├── messaging/    # MessageBus, MessageTypes
│   ├── rendering/    # WebGLContext, canvasSize, shaders, particles
│   └── systems/      # sistemas prontos
├── scaffold/         # Game, BaseGame
├── manager.ts        # Manager (loop + contexto + input)
└── index.ts          # barrel público
```

Parte dos testes é de caracterização: eles fixam o comportamento atual,
**inclusive os problemáticos** listados em
[Limitações conhecidas](#limitações-conhecidas). Quando uma refatoração mudar um
desses comportamentos de propósito, o teste correspondente deve ser reescrito
junto, não tratado como regressão.
