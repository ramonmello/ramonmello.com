import { defineSchema } from "tinacms";
import { pagesCollection } from "./collectionsSchema/pages";
import { tagsCollection } from "./collectionsSchema/tags";
import { profileCollection } from "./collectionsSchema/profile";

export const schema = defineSchema({
  collections: [pagesCollection, tagsCollection, profileCollection],
});
