"use client";

import { useTina } from "tinacms/dist/react";
import React from "react";

export type UseTinaProps = {
  query: string;
  variables: {
    relativePath: string;
  };
  data: {
    page: object;
  };
};

export type TinaClientProps = {
  props: UseTinaProps;
  Component: React.FC<any>;
};

export function TinaClient({ props, Component }: TinaClientProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return <Component {...data.page} />;
}
