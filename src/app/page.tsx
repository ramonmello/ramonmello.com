import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import { client } from "@/tina/__generated__/client";

import { HomePage } from "@home/pages/HomePage";

const HomePagePreview = dynamic(() => import("@home/pages/HomePagePreview"));

export default async function Home() {
  const draft = await draftMode();

  const { data, query, variables } = await client.queries.page({
    relativePath: "home.json",
  });

  if (data.page.__typename !== "PageHome") {
    throw new Error(
      `The homepage (home.json) needs to be of type "PageHome", but it is of type "${data.page.__typename}". Check the content in TinaCMS.`
    );
  }

  if (draft.isEnabled) {
    return (
      <HomePagePreview
        data={{ page: data.page }}
        query={query}
        variables={variables}
      />
    );
  }

  return <HomePage {...data.page} />;
}
