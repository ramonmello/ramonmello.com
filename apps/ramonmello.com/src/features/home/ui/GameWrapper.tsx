"use client";
import { useEffect, useRef } from "react";
import { useKeyboard } from "@games/hooks/useKeyboard";
import { asteroidsGame } from "@games/asteroids";
import { Manager } from "@engine/core";

export function GameWrapper() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keyboard = useKeyboard();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (cancelled || !canvasRef.current) return;

      const manager = Manager.getInstance();
      manager.setInputHandler(keyboard);
      if (manager.hasActiveGame()) {
        manager.rebindCanvas(canvasRef.current!);
        manager.resumeGame();
      } else {
        await manager.startGame(asteroidsGame, canvasRef.current!);
      }
    })();

    return () => {
      cancelled = true;
      Manager.getInstance().pauseGame();
    };
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
