import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import { HomePage } from "@home/pages/HomePage";
import { mapHome } from "@home/model/mapper";
import { cms } from "@/src/libs/cms/client";

const HomePagePreview = dynamic(() => import("@home/pages/HomePagePreview"));

export default async function Home() {
  const draft = await draftMode();
  const { data, query, variables } = await cms.getHome();

  if (draft.isEnabled) {
    return <HomePagePreview data={data} query={query} variables={variables} />;
  }

  const vm = mapHome(data.page);

  return <HomePage {...vm} />;
}
