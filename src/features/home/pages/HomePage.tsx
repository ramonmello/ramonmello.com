import Image from "next/image";
import { tinaField } from "tinacms/dist/react";
import { GameWrapper } from "../components/GameWrapper";
import { GameControlsGuide } from "../components/GameControlsGuide";

export function HomePage({ data }: { data: any }) {
  return (
    <>
      <GameWrapper />
      <div className="flex flex-col w-full justify-between relative z-10">
        <h1
          className="text-8xl font-bold md:text-9xl leading-20"
          data-tina-field={tinaField(data, "firstName")}
        >
          {data.firstName}
        </h1>
        <div className="inline-flex items-center">
          <Image
            className="rounded-full object-cover h-24 -ml-1"
            aria-hidden
            src={data.picture}
            alt="Fotografia Ramon Mello"
            width={96}
            height={96}
          />
          <h1
            className="text-8xl font-bold md:text-9xl"
            data-tina-field={tinaField(data, "lastName")}
          >
            {data.lastName}
          </h1>
        </div>
        <span
          className="font-lores-12 self-end text-lg w-full text-end mr-2"
          data-tina-field={tinaField(data, "role")}
        >
          {data.role}
        </span>
      </div>
      <GameControlsGuide />
    </>
  );
}
