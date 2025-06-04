"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useKeyboard } from "@/features/games/hooks/useKeyboard";
import { asteroidsGame } from "@/features/games/asteroids";
import { Manager } from "@/features/engine/manager";

export default function Home() {
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
    <>
      <div className="absolute bottom-24  md:bottom-14 left-1/2 -translate-x-1/2 font-lores-12">
        <div className="hidden md:block">
          <span className="font-nimbus">← →</span> : Girar |{" "}
          <span className="font-nimbus">↑</span> : Acelerar |{" "}
          <span className="font-nimbus">Espaço</span> : Disparar
        </div>
        <div className="md:hidden w-52">Acesse pelo PC para jogar!</div>
      </div>
      <div className="flex flex-col w-full justify-between relative z-10">
        <canvas
          ref={canvasRef}
          className="fixed inset-0 block -z-10 pointer-events-none"
        />

        <h1 className="text-8xl font-bold md:text-9xl leading-20">Ramon</h1>
        <div className="inline-flex items-center">
          <Image
            className="rounded-full object-cover h-24 -ml-1"
            aria-hidden
            src="/ramon-avatar.jpg"
            alt="Fotografia Ramon Mello"
            width={96}
            height={96}
          />
          <h1 className="text-8xl font-bold md:text-9xl">Mello</h1>
        </div>
        <span className="font-lores-12 self-end text-lg w-full text-end mr-2">
          * Full-Stack Developer
        </span>
      </div>
    </>
  );
}
