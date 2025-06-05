import { defineSchema } from "tinacms";
import { pagesCollection } from "./collectionsSchema/pages";

export const schema = defineSchema({
  collections: [pagesCollection],
});
