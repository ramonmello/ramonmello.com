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
      required: true,
      description:
        "Path relative to the public folder, e.g. /images/avatar.jpg",
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
        },
        {
          type: "string",
          label: "URL",
          name: "url",
          description: "https://…",
        },
      ],
    },
    {
      type: "rich-text",
      label: "Bio",
      name: "bio",
      required: true,
      description: "A brief text about yourself.",
    },
  ],
};
