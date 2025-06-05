import { HomePageTemplate } from "@home/pages/HomePage.template";
import { Collection } from "tinacms";

export const pagesCollection: Collection = {
  label: "Pages",
  name: "page",
  path: "content/blocksPages",
  format: "json",
  templates: [HomePageTemplate],
};
