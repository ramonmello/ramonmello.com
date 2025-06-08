"use client";

import { useTina } from "tinacms/dist/react";
import { HomePage } from "./HomePage";

type Props = {
  query: string;
  data: any;
  variables: {
    relativePath: string;
  };
};

export default function HomePagePreview(props: Props) {
  const { query, variables, data } = props;
  const { data: liveData } = useTina({
    query,
    variables,
    data,
  });

  return <HomePage data={liveData.page} />;
}
