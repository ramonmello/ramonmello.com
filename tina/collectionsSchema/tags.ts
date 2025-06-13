import { Collection } from "tinacms";

export const tagsCollection: Collection = {
  label: "Tags",
  name: "tag",
  path: "content/tags",
  format: "json",
  fields: [
    {
      type: "string",
      label: "Label",
      name: "label",
      required: true,
    },
  ],
};
