import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const SRC = fileURLToPath(new URL(".", import.meta.url));

/**
 * Globals the engine must not reach for: it renders into a canvas it was handed
 * and knows nothing about the page around it (see #59). Browser APIs scoped to
 * the render target — `ResizeObserver` on the canvas — stay allowed.
 */
const HOST_GLOBALS = /\b(window|document|localStorage|sessionStorage)\b/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) return sourceFiles(path);

    return entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")
      ? [path]
      : [];
  });
}

describe("isolamento da engine", () => {
  it("não referencia os globais do host em nenhum módulo", () => {
    const offenders = sourceFiles(SRC)
      .filter((file) => HOST_GLOBALS.test(readFileSync(file, "utf8")))
      .map((file) => relative(SRC, file));

    expect(offenders).toEqual([]);
  });
});
