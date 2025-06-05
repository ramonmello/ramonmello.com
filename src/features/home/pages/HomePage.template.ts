import { Template } from "tinacms";

export const HomePageTemplate: Template = {
  label: "Home",
  name: "home",
  fields: [
    {
      type: "string",
      label: "First Name",
      name: "firstName",
    },
    {
      type: "string",
      label: "Last Name",
      name: "lastName",
    },
    {
      type: "string",
      label: "Role",
      name: "role",
    },
    {
      type: "image",
      label: "Picture",
      name: "picture",
    },
  ],
};
