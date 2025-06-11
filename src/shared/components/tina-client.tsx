"use client";

import { useTina } from "tinacms/dist/react";
import React from "react";

export type UseTinaProps<T> = {
  query: string;
  variables: object;
  data: T;
};

export type TinaClientProps<T> = {
  props: UseTinaProps<any>;
  Component: React.FC<{ data: T }>;
};

export function TinaClient<T extends object>({
  props,
  Component,
}: TinaClientProps<T>) {
  const { data } = useTina<T>({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  return <Component data={data} />;
}
