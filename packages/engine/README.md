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
| **System**       | Só lógica. Declara `componentTypes`, tem `priority` (menor roda antes), um `enabled` e uma `phase` (`"simulation"`, o padrão, ou `"render"`). |
| **World**        | Guarda entidades e sistemas. `update(deltaTime)` roda os sistemas de simulação e `render(alpha)` os de render, em ordem de prioridade, passando para cada um apenas as entidades que têm todos os `componentTypes` exigidos. |
| **MessageBus**   | Publish/subscribe por string. Cada `World` tem o seu, e `World` e `Entity` delegam `emit`/`on` para ele.     |
| **Engine**       | Amarra um canvas, um jogo e uma fonte de input. Cria o contexto WebGL e roda o loop de `requestAnimationFrame` em passo fixo. |

O `World` não roda sozinho: alguém precisa chamar `update` e `render`. Quem faz
isso por você é a `Engine` (ver [O loop](#o-loop)).

Nada disso é global: uma `Engine` por canvas, um `MessageBus` por `World`, um
`WebGLContext` por canvas. Dois jogos podem coexistir no mesmo documento sem se
enxergar.

## Uso básico

### 1. ECS puro

Este trecho roda em qualquer lugar, inclusive em Node — não depende de canvas:

```ts
import {
  Entity,
  FRAME_TIME,
  System,
  TransformComponent,
  World,
} from "@engine/core";

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
world.update(FRAME_TIME);
```

Fora da `Engine`, quem chama `update` decide o passo — mas os sistemas assumem
`FRAME_TIME`, então é ele que você quer aqui.

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

A `Engine` é quem cria o contexto WebGL e roda o loop de
`requestAnimationFrame`. Tudo que ela precisa entra pelo construtor:

```ts
import { Engine, KeyboardHandler, KeyboardInputSystem } from "@engine/core";

export function mount(canvas: HTMLCanvasElement) {
  const pressed: Record<string, boolean> = {};
  window.addEventListener("keydown", (e) => (pressed[e.code] = true));
  window.addEventListener("keyup", (e) => (pressed[e.code] = false));

  const keyboard: KeyboardHandler = { getState: () => ({ ...pressed }) };

  const engine = new Engine({
    canvas,
    game: new DriftingBalls(),
    input: new KeyboardInputSystem(keyboard),
  });

  void engine.start();

  // Derruba o loop, o mundo e o contexto — use no cleanup do host.
  return () => engine.destroy();
}
```

`start()` inicializa o jogo na primeira chamada e apenas retoma nas seguintes,
então chamá-la duas vezes (ou em paralelo) não duplica sistemas nem entidades.
`pause()`/`resume()` param e retomam o loop, e `setCanvas()` move a run para
outro elemento, recompilando o contexto.

### O loop

A simulação anda em fatias de tamanho fixo (`FRAME_TIME`, 1/60s), nunca no delta
cru do `requestAnimationFrame`. Cada frame acumula o tempo decorrido, gasta o
acumulador em passos inteiros e desenha uma vez:

```
frameTime = min(now - lastTime, MAX_FRAME_TIME)   // teto de 250ms
accumulator += frameTime

while (accumulator >= FRAME_TIME) {
  world.update(FRAME_TIME)                        // fase "simulation"
  accumulator -= FRAME_TIME
}

world.render(accumulator / FRAME_TIME)            // fase "render"
```

Três consequências para quem escreve sistemas e jogos:

- **O `deltaTime` é sempre o mesmo.** O mesmo input dá o mesmo resultado num
  laptop a 30Hz e num monitor a 144Hz. Calibrar velocidades "por frame" voltou a
  ser uma medida bem definida.
- **Frames longos são fatiados, não simulados de uma vez.** Uma aba que volta do
  segundo plano devendo um segundo é simulada até o teto (`MAX_FRAME_TIME`, 15
  passos) e o resto é descartado — ninguém atravessa um collider por causa disso.
- **Render interpola.** `world.render(alpha)` recebe o quanto o frame avançou
  além do último passo, e `TransformComponent` guarda a pose do início do passo
  (`previousPosition`/`previousRotation`) para os sistemas de render misturarem
  via `interpolatedX/Y/Rotation(alpha)`. Um sistema que desenha precisa declarar
  `readonly phase: SystemPhase = "render"`; sem isso ele roda na simulação e
  desenha uma vez por passo.

Teleportes não devem ser interpolados: `setPosition`/`setRotation` já descartam
a pose anterior, e o wrap de bordas do `PhysicsSystem` desloca a origem junto
com o corpo.

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
import { COLLISION_EVENTS, Entity, World } from "@engine/core";

const unsubscribe = world.getMessageBus().on(COLLISION_EVENTS.DETECT, (data) => {
  const { entityA, entityB, world } = data as {
    entityA: Entity;
    entityB: Entity;
    world: World;
  };

  world.removeEntity(entityB.id);
  entityA.emit("scoreChanged", { points: 100 });
});

unsubscribe();
```

O cast é necessário: o payload trafega como `Record<string, unknown>`.

Dentro de um sistema, prefira `world.on(...)`: o disposer fica com o `World` e
cai junto no `clear()`/`destroy()`, em vez de sobreviver solto no barramento.

### 5. Contexto WebGL e shaders

Normalmente a `Engine` cuida disso, mas o contexto pode ser criado na mão —
útil em testes ou para rodar só o `RenderSystem`:

```ts
import { createWebGLContext, fixedCanvasSize } from "@engine/core";

export function setup(canvas: HTMLCanvasElement, world: World) {
  const context = createWebGLContext(canvas, {
    size: fixedCanvasSize(800, 600),
    fragmentShader: `precision mediump float;
uniform vec4 u_color;

void main() {
  gl_FragColor = vec4(u_color.rgb * 0.5, u_color.a);
}
`,
  });

  world.setRenderContext(context);
  return context;
}
```

O contexto só chega aos sistemas de render pelo `World`:
`world.setRenderContext(context)`. Um mundo sem contexto roda headless — os
sistemas de render viram no-op e `getViewport()` devolve zeros.

Os shaders são compilados na criação do contexto; para trocá-los, crie outro
(pela `Engine`, é a opção `shaders` do construtor). Qualquer shader próprio
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
| `RenderSystem`         | 100        | transform + render           | Fase `render`. Limpa a tela (opcional), ordena por `zIndex` e desenha cada entidade na pose interpolada, com o `drawMode` escolhido. |
| `EmitterRenderSystem`  | 110        | transform + particleEmitter  | Fase `render`. Desenha cada partícula como um quad, com alpha decaindo pela vida.                                              |

Prioridade menor roda antes, dentro de cada fase. Sistemas do jogo entram na
mesma escala — no Asteroids, o controle da nave usa `priority = 1` para rodar
antes da física.

### Rendering

- `createWebGLContext(canvas, options?)` — cria um contexto novo e compila os
  shaders. Nada é cacheado: um canvas, um contexto.
- `context.dispose()` — solta o `ResizeObserver` do contexto.
- `world.setRenderContext(context)` / `world.getRenderContext()` /
  `world.getViewport()` — como o contexto chega aos sistemas de render.
- `elementCanvasSize()` — o buffer segue o tamanho de layout do elemento
  (padrão); `fixedCanvasSize(w, h)` — trava num tamanho fixo.
- `DEFAULT_VERTEX_SHADER` / `DEFAULT_FRAGMENT_SHADER` — os shaders embutidos.

### Messaging

`MessageBus` expõe `on` (devolve o disposer), `emit`, `clearListeners`,
`clearAllListeners` e `hasListeners`. Cada `World` cria o seu (`getMessageBus()`);
para fazer dois mundos conversarem, passe o mesmo em `new World({ messageBus })`.
As constantes de evento
ficam em `MessageTypes`: `WORLD_EVENTS`, `COLLISION_EVENTS`, `PLAYER_EVENTS`,
`GAME_EVENTS`, `PROJECTILE_EVENTS`, `ENTITY_EVENTS` e `MESSAGE_TYPES`.

### Input

`InputSystem` é a interface (`getDirection`, `getActions`, `update`) e
`KeyboardInputSystem` a implementação de teclado, que lê de um `KeyboardHandler`
fornecido pelo host — quem escuta os eventos do DOM é o host, não a engine.

### Scaffold

`Game` (interface) e `BaseGame` (implementação abstrata). Quem roda o jogo é a
`Engine` (`src/Engine.ts`), instanciada por canvas.

## Limitações conhecidas

A engine é um projeto em andamento; o que ela **não** faz hoje:

- **Física é cinemática.** Não há gravidade nem resposta de colisão. O evento
  `collision.resolve` só avisa que dois corpos sólidos se tocaram — separar ou
  rebater é responsabilidade do jogo.
- **Velocidades são "por passo fixo".** `PhysicsSystem` multiplica tudo por
  `deltaTime * TARGET_FPS`, e a `Engine` só entrega passos de 1/60s — a unidade
  é bem definida, mas continua sendo px/passo, não px/segundo.
- **A interpolação é do transform, não das partículas.** O `EmitterRenderSystem`
  interpola a posição do emissor; as partículas em si andam por passo.
- **Colisão é O(n²)** e sem broadphase. `ColliderType.Polygon` existe no enum mas
  não tem teste próprio: cai num círculo aproximado.
- **Um draw call por entidade** (e por partícula, no `EmitterRenderSystem`). Não
  há batching, instancing nem atlas.
- **`ParticleSystem` ignora `deltaTime`** no deslocamento das partículas; só a
  vida usa dt.
- **Eventos não são tipados**: o payload é `Record<string, unknown>` e cabe ao
  consumidor fazer o cast.

APIs de navegador realmente usadas: canvas + WebGL 1.0, `ResizeObserver`,
`requestAnimationFrame` (que já traz o relógio do loop no timestamp do callback)
e `crypto.randomUUID()`. Nada de
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
│   ├── config/       # TARGET_FPS, FRAME_TIME, MAX_FRAME_TIME
│   ├── input/        # InputSystem, KeyboardInputSystem
│   ├── messaging/    # MessageBus, MessageTypes
│   ├── rendering/    # WebGLContext, canvasSize, shaders, particles
│   └── systems/      # sistemas prontos
├── scaffold/         # Game, BaseGame
├── Engine.ts         # Engine (loop + contexto + input), uma por canvas
└── index.ts          # barrel público
```

Parte dos testes é de caracterização: eles fixam o comportamento atual,
**inclusive os problemáticos** listados em
[Limitações conhecidas](#limitações-conhecidas). Quando uma refatoração mudar um
desses comportamentos de propósito, o teste correspondente deve ser reescrito
junto, não tratado como regressão.
