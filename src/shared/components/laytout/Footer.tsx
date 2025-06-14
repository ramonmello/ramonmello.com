import { GitHubIcon, LinkedInIcon } from "@shared/components/icons";

export function Footer() {
  return (
    <footer className="flex self-end w-full">
      <div className="inline-block ml-auto">
        <a
          className="flex mb-4"
          href="https://github.com/ramonmello"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
        </a>
        <a
          className="flex"
          href="https://www.linkedin.com/in/ramonmello/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInIcon />
        </a>
      </div>
    </footer>
  );
}
