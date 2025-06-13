import { CMSClient, TinaPageData } from "../types";
import { client as tina } from "@/tina/__generated__/client";
import { PageHome, PageAbout } from "@/tina/__generated__/types";

export class TinaCMS implements CMSClient {
  async getHome(): Promise<TinaPageData<PageHome>> {
    const { data, query, variables } = await loadPageData<PageHome>({
      relativePath: "home.json",
    });

    return { data, query, variables };
  }
  async getAbout(): Promise<TinaPageData<PageAbout>> {
    const { data, query, variables } = await loadPageData<PageAbout>({
      relativePath: "about.json",
    });

    return { data, query, variables };
  }
}

async function loadPageData<T>({ relativePath }: { relativePath: string }) {
  const { data, query, variables } = await tina.queries.page({
    relativePath,
  });

  return {
    data: {
      page: data.page as T,
    },
    query,
    variables,
  };
}
