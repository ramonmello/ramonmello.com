"use client";

import { useTina } from "tinacms/dist/react";
import { AboutPage } from "./AboutPage";

type Props = {
  query: string;
  data: any;
  variables: {
    relativePath: string;
  };
};

export default function AboutPagePreview(props: Props) {
  const { query, variables, data } = props;
  const { data: liveData } = useTina({
    query,
    variables,
    data,
  });

  return <AboutPage data={liveData.page} />;
}
