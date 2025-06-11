"use client";

import { HomePage, type HomePageProps } from "./HomePage";
import { TinaClient } from "@shared/components/tina-client";

type TinaData = {
  page: HomePageProps;
};

type Props = {
  query: string;
  data: { page: object };
  variables: {
    relativePath: string;
  };
};

export default function HomePagePreview(props: Props) {
  const HomePageWrapper = (tinaProps: { data: TinaData }) => {
    return <HomePage {...tinaProps.data.page} />;
  };

  return <TinaClient props={props} Component={HomePageWrapper} />;
}
