import { PageHome, PageAbout } from "@/tina/__generated__/types";

export interface CMSClient {
  getHome(): Promise<TinaPageData<PageHome>>;
  getAbout(): Promise<TinaPageData<PageAbout>>;
}

export type TinaPageData<T> = {
  data: { page: T };
  query: string;
  variables: { relativePath: string };
};

export type { PageHome as HomeCMS } from "@/tina/__generated__/types";
export type { PageAbout as AboutCMS } from "@/tina/__generated__/types";
