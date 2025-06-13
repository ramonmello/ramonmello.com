"use client";

import { HomePage, type HomeVM } from "./HomePage";
import { TinaClient, type UseTinaProps } from "@shared/components/tina-client";

export default function HomePagePreview(props: UseTinaProps<HomeVM>) {
  return <TinaClient props={props} Component={HomePage} />;
}
