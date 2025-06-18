import * as React from "react";
import { Tag } from "@shared/components/ui/Tag";
import { cn } from "@shared/utils/cn";
import type { Project } from "../model/types";
import { ExternalLinkIcon } from "@/src/shared/components/icons/ExternalLinkIcon";

type Props = {
  projects: Project[];
  className?: string;
};

export function Projects({ projects, className }: Props) {
  return (
    <section id="projects" className={cn("text-neutral-400", className)}>
      <h2 className="text-2xl font-bold text-white mb-8">Projetos</h2>
      <div className="mt-8 flex flex-col gap-12">
        {projects.map((project) => (
          <ProjectItem key={project.name} {...project} />
        ))}
      </div>
    </section>
  );
}

function ProjectItem({ name, summary, tags, link }: Project) {
  const Content = (
    <article className="border-l-2 border-neutral-700 pl-6 py-4 hover:border-neutral-300 transition-colors duration-300">
      <h3 className="text-xl font-medium text-white flex items-center">
        {name}
        {link && <ExternalLinkIcon className="ml-2" />}
      </h3>
      <p className="mt-2 bg-black">{summary}</p>
      <div className="flex gap-2 mt-4">
        {tags.map((tag) => (
          <Tag key={tag.id} label={tag.label} />
        ))}
      </div>
    </article>
  );

  return link ? (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="no-underline"
    >
      {Content}
    </a>
  ) : (
    Content
  );
}
