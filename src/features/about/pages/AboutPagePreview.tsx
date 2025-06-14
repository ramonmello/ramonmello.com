"use client";

import { AboutPage } from "./AboutPage";
import {
  TinaPreviewClient,
  type UseTinaProps,
} from "@shared/components/cms/TinaPreviewClient";

export default function AboutPagePreview(props: UseTinaProps<any>) {
  return <TinaPreviewClient props={props} Component={AboutPage} />;
}
