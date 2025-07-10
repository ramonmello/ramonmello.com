"use client";

import { AboutPage } from "./AboutPage";
// import { mapAbout } from "../model/mapper";
import { AboutCMS } from "@/src/libs/cms/types";

export default function AboutPagePreview(props: AboutCMS) {
  // const vm = mapAbout(data);

  return <AboutPage />;
}
