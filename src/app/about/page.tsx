import { headers } from "next/headers";
import dynamic from "next/dynamic";
import { client } from "@/tina/__generated__/client";
import { AboutPage } from "@about/pages/AboutPage";

const AboutPagePreview = dynamic(() => import("@about/pages/AboutPagePreview"));

export default async function About() {
  const headersList = await headers();
  const secFetchDest = headersList.get("sec-fetch-dest");
  const isInIframe = secFetchDest === "iframe";

  const { data, query, variables } = await client.queries.page({
    relativePath: "about.json",
  });

  if (isInIframe) {
    return <AboutPagePreview data={data} query={query} variables={variables} />;
  }

  return <AboutPage data={data.page} />;
}
