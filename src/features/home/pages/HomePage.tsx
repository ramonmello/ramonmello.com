import Image from "next/image";
import { GameWrapper } from "../components/GameWrapper";
import { GameControlsGuide } from "../components/GameControlsGuide";

export function HomePage() {
  return (
    <>
      <GameWrapper />
      <div className="flex flex-col w-full justify-between relative z-10">
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
      <GameControlsGuide />
    </>
  );
}
