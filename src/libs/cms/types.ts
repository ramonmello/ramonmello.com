import { PageHome, PageAbout, Profile } from "@/tina/__generated__/types";

export interface CMSClient {
  getHome(): Promise<HomeCMS>;
  getAbout(): Promise<AboutCMS>;
}

export type HomeCMS = {
  data: {
    page: PageHome;
  };
  query: string;
  variables: { relativePath: string };
};

export type AboutCMS = {
  data: {
    page: PageAbout;
    profile: Profile;
  };
  query: string;
  variables: { relativePath: string };
};
