"use client";

import { useTina } from "tinacms/dist/react";
import React from "react";

export type UseTinaProps<T extends object> = {
  query: string;
  variables: {
    relativePath: string;
  };
  data: {
    page: T;
  };
};

export type TinaClientProps<T extends object> = {
  props: UseTinaProps<T>;
  Component: React.FC<T>;
};

export function TinaPreviewClient<T extends object>({
  props,
  Component,
}: TinaClientProps<T>) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return <Component {...data.page} />;
}
