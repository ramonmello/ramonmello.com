"use client";

import { HomePage, type HomeVM } from "./HomePage";
import {
  TinaPreviewClient,
  type UseTinaProps,
} from "@shared/components/cms/TinaPreviewClient";

export default function HomePagePreview(props: UseTinaProps<HomeVM>) {
  return <TinaPreviewClient props={props} Component={HomePage} />;
}
