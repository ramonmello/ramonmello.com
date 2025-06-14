import { CMSClient, HomeCMS, AboutCMS } from "../types";
import { client as tina } from "@/tina/__generated__/client";
import { PageHome, PageAbout, Profile } from "@/tina/__generated__/types";

export class TinaCMS implements CMSClient {
  async getHome(): Promise<HomeCMS> {
    const { data, query, variables } = await tina.queries.page({
      relativePath: "home.json",
    });

    return {
      data: {
        page: data.page as PageHome,
      },
      query,
      variables,
    };
  }
  async getAbout(): Promise<AboutCMS> {
    const { data, query, variables } = await tina.queries.pageWithProfile({
      relativePath: "about.json",
    });

    return {
      data: { page: data.page as PageAbout, profile: data.profile as Profile },
      query,
      variables,
    };
  }
}
