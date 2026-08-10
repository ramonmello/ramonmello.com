import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createWebGLContext, WebGLContext } from "./Context";
import { CanvasSizeSource, fixedCanvasSize } from "./canvasSize";
import { DEFAULT_FRAGMENT_SHADER, DEFAULT_VERTEX_SHADER } from "./shaders";

const VERTEX_SHADER = 0x8b31;
const FRAGMENT_SHADER = 0x8b30;

type FakeShader = { type: number; source: string };

/**
 * Fake WebGL context: records the compiled sources and answers "ok" to
 * everything, which is enough to exercise `initShaders` without a GPU or DOM.
 */
function createFakeGL() {
  const shaders: FakeShader[] = [];

  const gl = {
    VERTEX_SHADER,
    FRAGMENT_SHADER,
    COMPILE_STATUS: 1,
    LINK_STATUS: 2,
    createShader: (type: number) => {
      const shader: FakeShader = { type, source: "" };
      shaders.push(shader);
      return shader;
    },
    shaderSource: (shader: FakeShader, source: string) => {
      shader.source = source;
    },
    compileShader: vi.fn(),
    getShaderParameter: () => true,
    getShaderInfoLog: () => "",
    createProgram: () => ({}),
    attachShader: vi.fn(),
    linkProgram: vi.fn(),
    getProgramParameter: () => true,
    getProgramInfoLog: () => "",
    createBuffer: () => ({}),
    getAttribLocation: () => 0,
    getUniformLocation: () => ({}),
    viewport: vi.fn(),
  };

  const sourceOf = (type: number) =>
    shaders.find((shader) => shader.type === type)?.source;

  return { gl, sourceOf };
}

function createCanvas(
  gl: unknown,
  clientWidth = 800,
  clientHeight = 600
): HTMLCanvasElement {
  return {
    width: 0,
    height: 0,
    clientWidth,
    clientHeight,
    getContext: () => gl,
  } as unknown as HTMLCanvasElement;
}

/**
 * Size source that reports dimensions on demand and keeps count of the resize
 * subscriptions still live, which is how the leak in #59 shows up.
 */
function createTrackedSize(width = 800, height = 600) {
  const watched: HTMLCanvasElement[] = [];
  let callbacks: Array<() => void> = [];
  let subscriptions = 0;

  const source: CanvasSizeSource = {
    measure: () => ({ width, height }),
    watch: (canvas, onResize) => {
      subscriptions += 1;
      watched.push(canvas);
      callbacks.push(onResize);
      return () => {
        callbacks = callbacks.filter((callback) => callback !== onResize);
      };
    },
  };

  return {
    source,
    watched,
    get live() {
      return callbacks.length;
    },
    get subscriptions() {
      return subscriptions;
    },
    resizeTo(nextWidth: number, nextHeight: number) {
      width = nextWidth;
      height = nextHeight;
      callbacks.forEach((notify) => notify());
    },
  };
}

describe("createWebGLContext", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn(() => {
      throw new Error("a engine não deve fazer requisições de rede");
    });
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("compila os shaders embutidos sem tocar na rede", () => {
    const { gl, sourceOf } = createFakeGL();

    createWebGLContext(createCanvas(gl));

    expect(sourceOf(VERTEX_SHADER)).toBe(DEFAULT_VERTEX_SHADER);
    expect(sourceOf(FRAGMENT_SHADER)).toBe(DEFAULT_FRAGMENT_SHADER);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("aceita shaders customizados pela config", () => {
    const { gl, sourceOf } = createFakeGL();

    createWebGLContext(createCanvas(gl), {
      vertexShader: "// vertex custom",
      fragmentShader: "// fragment custom",
    });

    expect(sourceOf(VERTEX_SHADER)).toBe("// vertex custom");
    expect(sourceOf(FRAGMENT_SHADER)).toBe("// fragment custom");
  });

  it("permite substituir só um dos dois, mantendo o outro embutido", () => {
    const { gl, sourceOf } = createFakeGL();

    createWebGLContext(createCanvas(gl), { fragmentShader: "// só o fragment" });

    expect(sourceOf(VERTEX_SHADER)).toBe(DEFAULT_VERTEX_SHADER);
    expect(sourceOf(FRAGMENT_SHADER)).toBe("// só o fragment");
  });

  it("dimensiona o canvas pelo tamanho do elemento e configura o viewport", () => {
    const { gl } = createFakeGL();
    const canvas = createCanvas(gl, 800, 600);

    createWebGLContext(canvas);

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
    expect(gl.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
  });

  it("respeita as dimensões fixas em vez do tamanho do elemento", () => {
    const { gl } = createFakeGL();
    const canvas = createCanvas(gl, 1920, 1080);

    createWebGLContext(canvas, { size: fixedCanvasSize(800, 600) });

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
    expect(gl.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
  });

  /**
   * Critério de aceite de #62: sem singleton de módulo, cada canvas ganha o
   * seu contexto e os dois coexistem com shaders próprios.
   */
  it("cria um contexto novo e independente por canvas", () => {
    const first = createFakeGL();
    const firstCanvas = createCanvas(first.gl);
    const second = createFakeGL();
    const secondCanvas = createCanvas(second.gl);

    const a = createWebGLContext(firstCanvas);
    const b = createWebGLContext(secondCanvas, {
      vertexShader: "// só do segundo",
    });

    expect(a).not.toBe(b);
    expect(a.canvas).toBe(firstCanvas);
    expect(b.canvas).toBe(secondCanvas);
    expect(first.sourceOf(VERTEX_SHADER)).toBe(DEFAULT_VERTEX_SHADER);
    expect(second.sourceOf(VERTEX_SHADER)).toBe("// só do segundo");
  });
});

describe("observação de tamanho do WebGLContext", () => {
  it("reage às mudanças de tamanho notificadas pela fonte", () => {
    const { gl } = createFakeGL();
    const canvas = createCanvas(gl);
    const size = createTrackedSize(800, 600);

    createWebGLContext(canvas, { size: size.source });
    size.resizeTo(1024, 768);

    expect(canvas.width).toBe(1024);
    expect(canvas.height).toBe(768);
    expect(gl.viewport).toHaveBeenLastCalledWith(0, 0, 1024, 768);
  });

  it("dispose() cancela a observação e pode ser chamado de novo sem efeito", () => {
    const size = createTrackedSize();
    const context = new WebGLContext(
      createCanvas(createFakeGL().gl),
      size.source
    );

    expect(size.live).toBe(1);

    context.dispose();
    context.dispose();

    expect(size.live).toBe(0);
    expect(size.subscriptions).toBe(1);
  });

  it("não avisa mais o contexto descartado quando o tamanho muda", () => {
    const { gl } = createFakeGL();
    const canvas = createCanvas(gl);
    const size = createTrackedSize(800, 600);
    const context = new WebGLContext(canvas, size.source);

    context.dispose();
    size.resizeTo(1024, 768);

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
  });

  it("criar e descartar contextos repetidamente não acumula observadores", () => {
    const size = createTrackedSize();

    for (let i = 0; i < 5; i += 1) {
      const context = createWebGLContext(createCanvas(createFakeGL().gl), {
        size: size.source,
      });
      expect(size.live).toBe(1);
      context.dispose();
    }

    expect(size.live).toBe(0);
    expect(size.subscriptions).toBe(5);
  });

  it("move a observação para o novo canvas ao reapontar o contexto", () => {
    const size = createTrackedSize();
    const firstCanvas = createCanvas(createFakeGL().gl);
    const secondCanvas = createCanvas(createFakeGL().gl);
    const context = createWebGLContext(firstCanvas, { size: size.source });

    context.setCanvas(secondCanvas);

    expect(size.live).toBe(1);
    expect(size.watched).toEqual([firstCanvas, secondCanvas]);
  });

  it("dois contextos vivos observam cada um o seu canvas", () => {
    const size = createTrackedSize();
    const firstCanvas = createCanvas(createFakeGL().gl);
    const secondCanvas = createCanvas(createFakeGL().gl);

    const a = createWebGLContext(firstCanvas, { size: size.source });
    const b = createWebGLContext(secondCanvas, { size: size.source });

    expect(size.live).toBe(2);

    a.dispose();
    expect(size.live).toBe(1);

    b.dispose();
    expect(size.live).toBe(0);
  });
});
