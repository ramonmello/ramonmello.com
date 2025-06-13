import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import { mapAbout } from "@about/mapper";
import { cms } from "@/lib/cms/client";
import { AboutPage } from "@about/pages/AboutPage";

const AboutPagePreview = dynamic(() => import("@about/pages/AboutPagePreview"));

export default async function About() {
  const draft = await draftMode();
  const { data, query, variables } = await cms.getAbout();
  const vm = mapAbout(data.page);

  if (draft.isEnabled) {
    return <AboutPagePreview data={data} query={query} variables={variables} />;
  }

  return <AboutPage {...vm} />;
}
