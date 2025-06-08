import { Template } from "tinacms";

export const ExperienceBlock: Template = {
  name: "experience",
  label: "Experiência",
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
};

export const ProjectBlock: Template = {
  name: "project",
  label: "Projeto",
  fields: [
    { type: "string", name: "title", label: "Título" },
    { type: "string", name: "link", label: "Link" },
    {
      type: "string",
      name: "description",
      label: "Descrição",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "technologies",
      label: "Tecnologias (separadas por vírgula)",
    },
  ],
};

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
      label: "Experiências",
      name: "experiences",
      list: true,
      templates: [ExperienceBlock],
    },
    {
      type: "object",
      label: "Projetos",
      name: "projects",
      list: true,
      templates: [ProjectBlock],
    },
  ],
};
