import type { Tag, SocialNetwork } from "@shared/model/types";

export type AboutVM = {
  profile: Profile;
  experiences?: Experience[];
  projects?: Project[];
};

export type Profile = {
  avatar: string;
  name: string;
  role: string;
  bio: string;
  socials: SocialNetwork[];
};

export type Project = {
  name: string;
  link?: string;
  summary: string;
  tags?: Tag[];
};

export type Experience = {
  role: string;
  company: string;
  startDate: string;
  currentJob: boolean;
  endDate?: string | null;
  contributions: string;
  tags?: Tag[] | null;
};
