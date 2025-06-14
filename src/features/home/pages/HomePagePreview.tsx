"use client";

import { HomePage } from "./HomePage";
import { mapHome } from "../model/mapper";
import { HomeCMS, TinaPageData } from "@/src/libs/cms/types";
import { useTina } from "tinacms/dist/react";

export default function HomePagePreview(props: TinaPageData<HomeCMS>) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const vm = mapHome(data.page);

  return <HomePage {...vm} />;
}
