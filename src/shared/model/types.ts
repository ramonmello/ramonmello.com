export type SocialNetwork = {
  platform: SocialPlatform;
  url: string;
};

export type Tag = {
  id: string;
  label: string;
};

export type SocialPlatform = "github" | "linkedin";
