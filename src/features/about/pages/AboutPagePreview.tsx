"use client";

import { AboutPage } from "./AboutPage";
import { TinaClient, type UseTinaProps } from "@shared/components/tina-client";

export default function AboutPagePreview(props: UseTinaProps<any>) {
  return <TinaClient props={props} Component={AboutPage} />;
}
