import { HomePageTemplate } from "@home/pages/HomePage.template";
import { AboutPageTemplate } from "@about/pages/AboutPage.template";
import { Collection } from "tinacms";

export const pagesCollection: Collection = {
  label: "Pages",
  name: "page",
  path: "content/pages",
  format: "json",
  ui: {
    router: ({ document, collection }) => {
      debugger;
      const fullPath = document._sys.path;
      const basePath = `${collection.path}`;
      const relativePath = fullPath
        .substring(basePath.length)
        .replace(/\.[^/.]+$/, "");

      if (relativePath === "/home") {
        return "/";
      }
      return `${relativePath}`;
    },
  },
  templates: [HomePageTemplate, AboutPageTemplate],
};
