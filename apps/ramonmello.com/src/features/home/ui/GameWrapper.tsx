"use client";
import { useEffect, useRef } from "react";
import { useKeyboard } from "@games/hooks/useKeyboard";
import { AsteroidsGame } from "@games/asteroids";
import { Engine, KeyboardInputSystem } from "@engine/core";

export function GameWrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keyboard = useKeyboard();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // One engine per mount, owning its own game, world and WebGL context —
    // so a StrictMode double-effect builds and tears down two independent
    // runs instead of corrupting a shared one.
    const engine = new Engine({
      canvas,
      game: new AsteroidsGame(),
      input: new KeyboardInputSystem(keyboard),
    });

    void engine.start();

    return () => engine.destroy();
  }, [keyboard]);

  return (
    // `w-screen h-screen` is what actually stretches the canvas: `inset-0`
    // leaves a replaced element at its intrinsic size, and the engine sizes its
    // drawing buffer from the element's layout box.
    <canvas
      ref={canvasRef}
      className="fixed inset-0 block w-screen h-screen -z-10 pointer-events-none"
    />
  );
}
