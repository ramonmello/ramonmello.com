import { AboutCMS } from "@/src/libs/cms/types";
import { AboutVM } from "./types";
import { SocialPlatform } from "@/src/shared/model/types";

export function mapAbout(data: AboutCMS["data"]): AboutVM {
  const dto = data.page;
  const profileDto = data.profile;

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

  const profile = {
    avatar: profileDto.avatar,
    name: profileDto.name,
    role: profileDto.role,
    bio: profileDto.bio,
    socials: (profileDto.socials ?? []).map((s) => ({
      platform: s?.platform.toLowerCase() as SocialPlatform,
      url: s?.url || "",
    })),
  };

  return {
    profile,
    experiences,
    projects,
  };
}
