import { draftMode } from "next/headers";
import dynamic from "next/dynamic";
import { HomePage } from "@home/pages";
import { mapHome } from "@home/model/mapper";
import { cms } from "@/src/libs/cms/client";

const HomePagePreview = dynamic(() => import("@home/pages/HomePagePreview"));

export default async function Home() {
  const draft = await draftMode();
  const { data, query, variables } = await cms.getHome();

  const vm = mapHome(data.page);

  if (draft.isEnabled) {
    return <HomePagePreview data={data} query={query} variables={variables} />;
  }

  return <HomePage {...vm} />;
}
