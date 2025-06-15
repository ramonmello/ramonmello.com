"use client";

import { HomePage } from "./HomePage";
import { HomeCMS } from "@/src/libs/cms/types";
import { useTina } from "tinacms/dist/react";

export default function HomePagePreview(props: HomeCMS) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return <HomePage {...data.page} />;
}
