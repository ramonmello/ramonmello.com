/** Drawing-buffer size, in pixels. */
export interface CanvasSize {
  width: number;
  height: number;
}

/**
 * Decides how big the drawing buffer should be, so the engine never reads the
 * page around the canvas: a full-page host watches the element and reports its
 * layout size, a fixed-size one answers the same numbers forever.
 */
export interface CanvasSizeSource {
  measure(canvas: HTMLCanvasElement): CanvasSize;

  /**
   * Subscribes to size changes. The returned teardown must remove everything
   * the subscription registered — {@link WebGLContext.dispose} relies on it to
   * avoid leaking listeners across contexts.
   */
  watch?(canvas: HTMLCanvasElement, onResize: () => void): () => void;
}

/** Locks the drawing buffer to `width` x `height`, ignoring layout changes. */
export function fixedCanvasSize(
  width: number,
  height: number
): CanvasSizeSource {
  return { measure: () => ({ width, height }) };
}

/**
 * Follows the canvas element's own layout size, tracked with `ResizeObserver`
 * when the host provides one. Default source: it fits a canvas stretched by
 * CSS without the engine ever asking the host how big its viewport is.
 */
export function elementCanvasSize(): CanvasSizeSource {
  return {
    measure: (canvas) => ({
      width: canvas.clientWidth || canvas.width,
      height: canvas.clientHeight || canvas.height,
    }),

    watch: (canvas, onResize) => {
      if (typeof ResizeObserver === "undefined") return () => {};

      const observer = new ResizeObserver(() => onResize());
      observer.observe(canvas);
      return () => observer.disconnect();
    },
  };
}
