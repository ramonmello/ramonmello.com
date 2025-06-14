"use client";

import { HomePage } from "./HomePage";
import { mapHome } from "../model/mapper";
import { HomeCMS } from "@/src/libs/cms/types";
import { useTina } from "tinacms/dist/react";

export default function HomePagePreview(props: HomeCMS) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const vm = mapHome(data);

  return <HomePage {...vm} />;
}
