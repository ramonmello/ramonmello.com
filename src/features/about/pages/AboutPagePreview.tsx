"use client";

import { AboutPage } from "./AboutPage";
import { mapAbout } from "../model/mapper";
import { AboutCMS, TinaPageData } from "@/src/libs/cms/types";
import { useTina } from "tinacms/dist/react";

export default function AboutPagePreview(props: TinaPageData<AboutCMS>) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const vm = mapAbout(data.page);

  return <AboutPage {...vm} />;
}
