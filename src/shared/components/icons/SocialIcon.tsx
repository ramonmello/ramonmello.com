import { SocialPlatform } from "@/src/shared/model/types";
import { GitHubIcon } from "./GitHubIcon";
import { LinkedInIcon } from "./LinkedInIcon";

type Props = React.SVGProps<SVGSVGElement> & {
  platform: SocialPlatform;
};

export const SocialIcon = ({ platform, ...props }: Props) => {
  switch (platform) {
    case "github":
      return <GitHubIcon {...props} />;
    case "linkedin":
      return <LinkedInIcon {...props} />;
  }
};
