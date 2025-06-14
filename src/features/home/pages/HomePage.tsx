import Image from "next/image";
import { GameWrapper } from "../ui/GameWrapper";
import { HomeVM } from "../model/types";

export function HomePage(data: HomeVM) {
  console.log("#### DATA ###", data);
  const { firstName, lastName, role, picture } = data;

  return (
    <>
      <GameWrapper />
      <div className="flex flex-col w-full justify-between relative z-10">
        <h1 className="text-8xl font-bold md:text-9xl leading-20">
          {firstName}
        </h1>
        <div className="inline-flex items-center">
          <Image
            className="rounded-full object-cover h-24 -ml-1"
            aria-hidden
            src={picture}
            alt="Fotografia Ramon Mello"
            width={96}
            height={96}
          />
          <h1 className="text-8xl font-bold md:text-9xl">{lastName}</h1>
        </div>
        <span className="font-lores-12 self-end text-lg w-full text-end mr-2">
          {role}
        </span>
      </div>
    </>
  );
}
