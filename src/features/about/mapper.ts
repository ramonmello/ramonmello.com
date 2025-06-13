import { AboutCMS } from "@shared/lib/cms/types";
import { AboutVM } from "./pages/AboutPage";

export function mapAbout(dto: AboutCMS): AboutVM {
  const experiences = dto.experiences?.map((exp) => ({
    role: exp.role || "",
    company: exp.company || "",
    startDate: exp.startDate || "",
    currentJob: exp.currentJob || false,
    endDate: exp.endDate,
    contributions: exp.contributions || "",
    tags: exp.tags?.map((t) => ({
      id: t?.tag?.id || "",
      label: t?.tag?.label || "",
    })),
  }));

  const projects =
    dto.projects
      ?.map((proj) => {
        if (!proj) return null;
        return {
          name: proj.name || "",
          link: proj.link || undefined,
          summary: proj.summary || "",
          tags: proj.tags?.map((t) => ({
            id: t?.tag?.id || "",
            label: t?.tag?.label || "",
          })),
        };
      })
      .filter((proj): proj is NonNullable<typeof proj> => proj !== null) || [];

  return {
    title: dto.title || "",
    description: dto.description || "",
    experiences,
    projects,
  };
}
