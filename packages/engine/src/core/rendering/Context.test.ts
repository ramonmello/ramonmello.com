import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearWebGLContext,
  getWebGLContext,
  initWebGLContext,
} from "./Context";
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

function createCanvas(gl: unknown): HTMLCanvasElement {
  return {
    width: 0,
    height: 0,
    getContext: () => gl,
  } as unknown as HTMLCanvasElement;
}

describe("initWebGLContext", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    clearWebGLContext();
    // `WebGLContext` still reads `window` to size the canvas (see #59).
    vi.stubGlobal("window", {
      innerWidth: 800,
      innerHeight: 600,
      addEventListener: vi.fn(),
    });
    fetchSpy = vi.fn(() => {
      throw new Error("a engine não deve fazer requisições de rede");
    });
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    clearWebGLContext();
    vi.unstubAllGlobals();
  });

  it("compila os shaders embutidos sem tocar na rede", () => {
    const { gl, sourceOf } = createFakeGL();

    initWebGLContext(createCanvas(gl));

    expect(sourceOf(VERTEX_SHADER)).toBe(DEFAULT_VERTEX_SHADER);
    expect(sourceOf(FRAGMENT_SHADER)).toBe(DEFAULT_FRAGMENT_SHADER);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("aceita shaders customizados pela config", () => {
    const { gl, sourceOf } = createFakeGL();

    initWebGLContext(createCanvas(gl), {
      vertexShader: "// vertex custom",
      fragmentShader: "// fragment custom",
    });

    expect(sourceOf(VERTEX_SHADER)).toBe("// vertex custom");
    expect(sourceOf(FRAGMENT_SHADER)).toBe("// fragment custom");
  });

  it("permite substituir só um dos dois, mantendo o outro embutido", () => {
    const { gl, sourceOf } = createFakeGL();

    initWebGLContext(createCanvas(gl), { fragmentShader: "// só o fragment" });

    expect(sourceOf(VERTEX_SHADER)).toBe(DEFAULT_VERTEX_SHADER);
    expect(sourceOf(FRAGMENT_SHADER)).toBe("// só o fragment");
  });

  it("dimensiona o canvas e configura o viewport na criação", () => {
    const { gl } = createFakeGL();
    const canvas = createCanvas(gl);

    initWebGLContext(canvas);

    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(600);
    expect(gl.viewport).toHaveBeenCalledWith(0, 0, 800, 600);
  });

  it("reaproveita o contexto existente, apenas reapontando o canvas", () => {
    const first = createFakeGL();
    const context = initWebGLContext(createCanvas(first.gl));

    const second = createFakeGL();
    const secondCanvas = createCanvas(second.gl);
    const reused = initWebGLContext(secondCanvas, {
      vertexShader: "// ignorado num contexto já criado",
    });

    expect(reused).toBe(context);
    expect(reused.canvas).toBe(secondCanvas);
    expect(second.sourceOf(VERTEX_SHADER)).toBeUndefined();
  });

  it("recompila com os novos shaders depois de clearWebGLContext", () => {
    initWebGLContext(createCanvas(createFakeGL().gl));
    clearWebGLContext();

    const { gl, sourceOf } = createFakeGL();
    initWebGLContext(createCanvas(gl), { vertexShader: "// recompilado" });

    expect(sourceOf(VERTEX_SHADER)).toBe("// recompilado");
  });

  it("falha ao pedir o contexto antes de inicializar", () => {
    expect(() => getWebGLContext()).toThrow("WebGLContext not initialized");
  });
});
