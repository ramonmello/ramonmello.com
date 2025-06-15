import { TinaField } from "tinacms";

export const tagsReference: TinaField = {
  name: "tags",
  label: "Tags",
  list: true,
  type: "object",
  ui: {
    itemProps: (item) => {
      const path = item.tag;
      const regex = /content\/tags\/(.+?)\.json/;

      if (path) {
        const match = path.match(regex);
        return { label: match[1] };
      }

      return { label: "new tag" };
    },
  },
  fields: [
    {
      type: "reference",
      name: "tag",
      label: "Tag",
      required: true,
      collections: ["tag"],
    },
  ],
};
