import { Template } from "tinacms";

export const AboutPageTemplate: Template = {
  label: "About",
  name: "about",
  fields: [
    { type: "string", label: "Title", name: "title" },
    {
      type: "string",
      label: "Descrição",
      name: "description",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      label: "Experiences",
      name: "experiences",
      list: true,
      fields: [
        { type: "string", name: "title", label: "Título" },
        { type: "string", name: "company", label: "Empresa" },
        {
          type: "string",
          name: "description",
          label: "Descrição",
          ui: { component: "textarea" },
        },
        { type: "string", name: "startDate", label: "Data de início" },
        { type: "string", name: "endDate", label: "Data de término" },
        {
          type: "string",
          name: "technologies",
          label: "Tecnologias (separadas por vírgula)",
        },
      ],
    },
    {
      type: "object",
      label: "Projects",
      name: "projects",
      list: true,
      fields: [
        {
          type: "string",
          name: "title",
          label: "Título",
        },
        {
          type: "string",
          name: "link",
          label: "Link",
        },
        {
          type: "string",
          name: "description",
          label: "Descrição",
          ui: { component: "textarea" },
        },
        {
          name: "tags",
          label: "Tags",
          list: true,
          type: "object",
          ui: {
            itemProps: (item) => {
              console.log("TESTE ###############", item);
              return { label: "🗂️ " + item?.tag?.label };
            },
          },
          fields: [
            {
              type: "reference",
              name: "tag",
              label: "Tag",
              collections: ["tag"],
            },
          ],
        },
      ],
    },
  ],
};
