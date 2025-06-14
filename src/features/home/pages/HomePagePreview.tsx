"use client";

import { HomePage } from "./HomePage";
import { HomeVM } from "../model/types";
import {
  TinaPreviewClient,
  type UseTinaProps,
} from "@shared/components/cms/TinaPreviewClient";

export default function HomePagePreview(props: UseTinaProps<HomeVM>) {
  return <TinaPreviewClient props={props} Component={HomePage} />;
}
