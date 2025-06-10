import { Template } from "tinacms";
import { tagsReference } from "@/tina/sharedFields/tagsReference";

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
        { type: "string", name: "role", label: "Role" },
        { type: "string", name: "company", label: "Company" },
        {
          type: "datetime",
          name: "startDate",
          label: "Start Date",
          ui: { component: "date", dateFormat: "MM/YYYY" },
        },
        {
          type: "boolean",
          name: "currentJob",
          label: "Current Job",
        },
        {
          type: "datetime",
          name: "endDate",
          label: "End Date",
          ui: {
            component: "date",
            dateFormat: "MM/YYYY",
          },
        },
        {
          type: "string",
          name: "contributions",
          label: "Contributions",
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
