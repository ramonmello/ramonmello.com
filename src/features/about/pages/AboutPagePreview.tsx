"use client";

import { AboutPage } from "./AboutPage";
import { AboutVM } from "../model/types";
import {
  TinaPreviewClient,
  type UseTinaProps,
} from "@shared/components/cms/TinaPreviewClient";

export default function AboutPagePreview(props: UseTinaProps<AboutVM>) {
  return <TinaPreviewClient props={props} Component={AboutPage} />;
}
