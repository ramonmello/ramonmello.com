import Image from "next/image";
import { GameWrapper } from "../ui/GameWrapper";
import { HomeVM } from "../model/types";
import { tinaField } from "tinacms/dist/react";

export function HomePage(data: HomeVM) {
  return (
    <>
      <GameWrapper />
      <div className="flex flex-col w-full justify-between relative">
        <h1
          data-tina-field={tinaField(data, "firstName")}
          className="text-8xl font-bold md:text-9xl leading-20"
        >
          {data.firstName}
        </h1>
        <div className="inline-flex items-center">
          <Image
            className="rounded-full object-cover h-24 -ml-1"
            data-tina-field={tinaField(data, "picture")}
            aria-hidden
            src={data.picture}
            alt="Fotografia Ramon Mello"
            width={96}
            height={96}
          />
          <h1
            data-tina-field={tinaField(data, "lastName")}
            className="text-8xl font-bold md:text-9xl"
          >
            {data.lastName}
          </h1>
        </div>
        <span
          data-tina-field={tinaField(data, "role")}
          className="font-lores-12 self-end text-lg w-full text-end mr-2"
        >
          {data.role}
        </span>
      </div>
    </>
  );
}
