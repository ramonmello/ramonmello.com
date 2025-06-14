import { Template } from "tinacms";
import { tagsReference } from "@/tina/collectionsSchema/sharedFields/tagsReference";

export const AboutPageTemplate: Template = {
  label: "About",
  name: "about",
  fields: [
    {
      type: "object",
      label: "Experiences",
      name: "experiences",
      list: true,
      required: true,
      ui: {
        itemProps: (item) => {
          return {
            label: `${item.company} - ${item.role}`,
          };
        },
      },
      fields: [
        { type: "string", name: "role", label: "Role", required: true },
        { type: "string", name: "company", label: "Company", required: true },
        {
          type: "datetime",
          name: "startDate",
          label: "Start Date",
          required: true,
          ui: { component: "date", dateFormat: "MM/YYYY" },
        },
        {
          type: "boolean",
          name: "currentJob",
          label: "Current Job",
          required: true,
        },
        {
          type: "datetime",
          name: "endDate",
          label: "End Date",
          required: false,
          ui: {
            component: "date",
            dateFormat: "MM/YYYY",
          },
        },
        {
          type: "string",
          name: "contributions",
          label: "Contributions",
          required: true,
          ui: { component: "textarea" },
        },
        tagsReference,
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
          name: "name",
          label: "Name",
        },
        {
          type: "string",
          name: "link",
          label: "Link",
        },
        {
          type: "string",
          name: "summary",
          label: "Summary",
          ui: { component: "textarea" },
        },
        tagsReference,
      ],
    },
  ],
};
