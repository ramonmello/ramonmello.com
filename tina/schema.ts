import { defineSchema } from "tinacms";
import { pagesCollection } from "./collectionsSchema/pages";
import { tagsCollection } from "./collectionsSchema/tags";

export const schema = defineSchema({
  collections: [pagesCollection, tagsCollection],
});
