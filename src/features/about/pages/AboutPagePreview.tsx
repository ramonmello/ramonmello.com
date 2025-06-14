"use client";

import { AboutPage } from "./AboutPage";
import { mapAbout } from "../model/mapper";
import { AboutCMS } from "@/src/libs/cms/types";
import { useTina } from "tinacms/dist/react";

export default function AboutPagePreview(props: AboutCMS) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  const vm = mapAbout(data);

  return <AboutPage {...vm} />;
}
