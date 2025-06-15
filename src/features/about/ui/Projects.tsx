import { cn } from "@shared/utils/cn";
import { Tag } from "@shared/components/ui/Tag";
import { ExternalLinkIcon } from "@shared/components/icons";
import type { Project } from "../model/types";

type Props = {
  projects: Project[];
};

export function Projects(props: Props) {
  return (
    <section id="projects" className="text-neutral-400">
      <h2 className="text-2xl font-bold text-white mb-8">Projetos</h2>
      <div className="mt-8 flex flex-col gap-12">
        {props.projects.map((project) => (
          <a key={project.name} href={project.link} target="_blank">
            <article
              key={project.name}
              className={cn(
                "border-l-2 group hover:translate-x-2 border-neutral-700 pl-6 py-4 hover:border-neutral-300 ease-in-out transition-all duration-300",
                { "cursor-pointer": !!project?.link }
              )}
            >
              <h3 className="text-xl font-medium text-white flex items-center">
                {project.name}
                {project?.link && (
                  <ExternalLinkIcon className="ml-2 group-hover:ml-3 group-hover:size-5 transition-all duration-300 ease-in-out" />
                )}
              </h3>
              <p className="mt-2">{project.summary}</p>
              <div className="flex gap-2 mt-4">
                {project.tags.map((tag) => (
                  <Tag key={tag.id} label={tag.label} />
                ))}
              </div>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}
