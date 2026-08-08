import { afterEach, describe, expect, it, vi } from "vitest";
import { elementCanvasSize, fixedCanvasSize } from "./canvasSize";

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];

  observed: unknown[] = [];

  disconnected = false;

  constructor(private readonly callback: () => void) {
    FakeResizeObserver.instances.push(this);
  }

  observe(target: unknown) {
    this.observed.push(target);
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true;
  }

  trigger() {
    this.callback();
  }
}

function createCanvas(
  clientWidth: number,
  clientHeight: number,
  width = 0,
  height = 0
): HTMLCanvasElement {
  return {
    width,
    height,
    clientWidth,
    clientHeight,
  } as unknown as HTMLCanvasElement;
}

afterEach(() => {
  FakeResizeObserver.instances = [];
  vi.unstubAllGlobals();
});

describe("fixedCanvasSize", () => {
  it("responde sempre as mesmas dimensões", () => {
    const size = fixedCanvasSize(800, 600);

    expect(size.measure(createCanvas(1920, 1080))).toEqual({
      width: 800,
      height: 600,
    });
  });

  it("não observa nada", () => {
    expect(fixedCanvasSize(800, 600).watch).toBeUndefined();
  });
});

describe("elementCanvasSize", () => {
  it("mede o tamanho de layout do elemento", () => {
    expect(elementCanvasSize().measure(createCanvas(1024, 768))).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it("cai para as dimensões atuais do canvas quando o layout mede zero", () => {
    expect(elementCanvasSize().measure(createCanvas(0, 0, 300, 150))).toEqual({
      width: 300,
      height: 150,
    });
  });

  it("observa o canvas com ResizeObserver e desconecta no teardown", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const canvas = createCanvas(1024, 768);
    const onResize = vi.fn();

    const unwatch = elementCanvasSize().watch!(canvas, onResize);
    const [observer] = FakeResizeObserver.instances;

    expect(observer.observed).toEqual([canvas]);

    observer.trigger();
    expect(onResize).toHaveBeenCalledTimes(1);

    unwatch();
    expect(observer.disconnected).toBe(true);
  });

  it("é inofensivo em hosts sem ResizeObserver", () => {
    const unwatch = elementCanvasSize().watch!(
      createCanvas(1024, 768),
      vi.fn()
    );

    expect(FakeResizeObserver.instances).toHaveLength(0);
    expect(() => unwatch()).not.toThrow();
  });
});
