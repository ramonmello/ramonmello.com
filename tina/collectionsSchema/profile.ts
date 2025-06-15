import { Collection } from "tinacms";

export const profileCollection: Collection = {
  label: "Profile",
  name: "profile",
  path: "content/settings",
  format: "json",
  defaultItem: {
    avatar: "/images/avatar.jpg",
    name: "Your Name",
    role: "full-stack",
    socials: [],
    bio: "A short bio about yourself.",
  },
  ui: {
    global: true,
    allowedActions: {
      create: false,
      delete: false,
      createNestedFolder: false,
    },
  },
  fields: [
    {
      type: "image",
      label: "Avatar",
      name: "avatar",
      description:
        "Path relative to the public folder, e.g. /images/avatar.jpg",
      required: true,
    },
    {
      type: "string",
      label: "Name",
      name: "name",
      description: "Your name",
      required: true,
    },
    {
      type: "string",
      label: "Role",
      name: "role",
      required: true,
      description: "e.g. full-stack, front-end, back-end, etc.",
    },
    {
      type: "object",
      label: "Social Links",
      name: "socials",
      list: true,
      required: true,
      ui: {
        itemProps: (item) => {
          return {
            label: item.platform,
          };
        },
      },
      fields: [
        {
          type: "string",
          label: "Platform",
          name: "platform",
          description: "e.g. Twitter, GitHub, LinkedIn",
          required: true,
        },
        {
          type: "string",
          label: "URL",
          name: "url",
          description: "https://…",
          required: true,
        },
      ],
    },
    {
      type: "string",
      ui: {
        component: "textarea",
      },
      label: "Bio",
      name: "bio",
      description: "A brief text about yourself.",
      required: true,
    },
  ],
};
