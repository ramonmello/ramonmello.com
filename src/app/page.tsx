import { headers } from "next/headers";
import dynamic from "next/dynamic";
import { client } from "@/tina/__generated__/client";
import { HomePage } from "@home/pages/HomePage";

const HomePagePreview = dynamic(() => import("@home/pages/HomePagePreview"));

export default async function Home() {
  const headersList = await headers();
  const secFetchDest = headersList.get("sec-fetch-dest");
  const isInIframe = secFetchDest === "iframe";

  const { data, query, variables } = await client.queries.page({
    relativePath: "home.json",
  });

  if (isInIframe) {
    return <HomePagePreview data={data} query={query} variables={variables} />;
  }

  return <HomePage data={data.page} />;
}
