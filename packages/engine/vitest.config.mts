import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // A engine é agnóstica de DOM em todo o núcleo (World, Entity, MessageBus,
    // sistemas de física/colisão). O único módulo que toca em browser APIs é
    // rendering/Context.ts, que os testes mockam pontualmente.
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/index.ts", "src/**/index.ts"],
    },
  },
});
