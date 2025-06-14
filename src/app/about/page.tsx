import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import { mapAbout } from "@about/model/mapper";
import { cms } from "@/src/libs/cms/client";
import { AboutPage } from "@about/pages/AboutPage";

const AboutPagePreview = dynamic(() => import("@about/pages/AboutPagePreview"));

export default async function About() {
  const draft = await draftMode();
  const { data, query, variables } = await cms.getAbout();

  if (draft.isEnabled) {
    return <AboutPagePreview data={data} query={query} variables={variables} />;
  }

  const vm = mapAbout(data.page);

  return <AboutPage {...vm} />;
}
