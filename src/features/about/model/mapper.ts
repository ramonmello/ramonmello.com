import { AboutCMS } from "@/src/libs/cms/types";
import type { SocialPlatform } from "@shared/model/types";
import { AboutVM } from "./types";

export function mapAbout(data: AboutCMS["data"]): AboutVM {
  const { experiences, projects } = data.page;
  const profileDto = data.profile;

  const mappedExperiences = experiences.map((exp) => ({
    role: exp.role,
    company: exp.company,
    startDate: new Date(exp.startDate),
    currentJob: exp.currentJob,
    endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    contributions: exp.contributions,
    tags: exp.tags.map((t) => ({
      id: t.tag.id,
      label: t.tag.label,
    })),
  }));

  const mappedProjects = projects.map((p) => ({
    name: p.name,
    link: p?.link || undefined,
    summary: p.summary,
    tags: p.tags.map((t) => ({
      id: t.tag.id,
      label: t.tag.label,
    })),
  }));

  const profile = {
    avatar: profileDto.avatar,
    name: profileDto.name,
    role: profileDto.role,
    bio: profileDto.bio,
    socials: profileDto.socials.map((s) => ({
      platform: s.platform.toLowerCase() as SocialPlatform,
      url: s.url,
    })),
  };

  return {
    profile,
    experiences: mappedExperiences,
    projects: mappedProjects,
  };
}
