"use client";

import { HomePage } from "./HomePage";
import { TinaClient, type UseTinaProps } from "@shared/components/tina-client";

export default function HomePagePreview(props: UseTinaProps) {
  return <TinaClient props={props} Component={HomePage} />;
}
