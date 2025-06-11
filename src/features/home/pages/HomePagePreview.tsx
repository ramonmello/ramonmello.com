"use client";

import { HomePage, type HomePageProps } from "./HomePage";
import { TinaClient, type UseTinaProps } from "@shared/components/tina-client";

export default function HomePagePreview(props: UseTinaProps<HomePageProps>) {
  return <TinaClient props={props} Component={HomePage} />;
}
