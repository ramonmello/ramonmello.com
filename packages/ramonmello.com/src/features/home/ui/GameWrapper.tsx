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
        await manager.rebindCanvas(canvasRef.current!);
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 block -z-10 pointer-events-none"
    />
  );
}
