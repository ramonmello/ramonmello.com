import { Template } from "tinacms";

export const HomePageTemplate: Template = {
  label: "Home",
  name: "home",
  fields: [
    {
      type: "string",
      label: "First Name",
      name: "firstName",
      required: true,
    },
    {
      type: "string",
      label: "Last Name",
      name: "lastName",
      required: true,
    },
    {
      type: "string",
      label: "Role",
      name: "role",
      required: true,
    },
    {
      type: "image",
      label: "Picture",
      name: "picture",
      required: true,
    },
  ],
};
