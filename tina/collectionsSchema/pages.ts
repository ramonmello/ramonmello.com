import { HomePageTemplate } from "@home/pages/HomePage.template";
import { Collection } from "tinacms";

export const pagesCollection: Collection = {
  label: "Pages",
  name: "page",
  path: "content/pages",
  format: "json",
  templates: [HomePageTemplate],
};
