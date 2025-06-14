// import ExternalLinkIcon from "@shared/components/icons/ExternalLinkIcon";
import { cn } from "@/src/shared/utils/cn";
import { Tag } from "./Tag";

const projects = [
  {
    key: "0",
    title: "Orbita",
    link: "https://orbita.press",
    description:
      "Hub de conteúdo do ecossistema Sens Public que centraliza artigos, notícias e eventos em um único domínio, usando busca semântica Algolia para conectar temas e projetos.",
    technologies: [
      "Next.js",
      "Algolia",
      "Tailwind CSS",
      "Radix UI",
      "Shadcn UI",
    ],
  },
  {
    key: "1",
    title: "Engine 2D (nome provisório, aceito sugestões!)",
    link: "https://github.com/ramonmello/ramonmello.github.io/tree/main/engine",
    description:
      "Projeto experimental que transforma páginas web em ambientes gamificados: o usuário navega como em um jogo, enquanto elementos da interface e do mundo 2D reagem de forma integrada, apagando a linha entre conteúdo e gameplay.",
    technologies: ["Canvas API", "WebGL", "Typescript"],
  },
  {
    key: "2",
    title: "Synkinator",
    link: "",
    description:
      "Ferramenta em desenvolvimento que automatiza o processo de ingest de fotos e vídeos, permitindo fluxos personalizados de importação, organização e backup para fotógrafos e videomakers.",
    technologies: ["React", "Tauri", "TanStack Router"],
  },
  {
    key: "3",
    title: "Crigo",
    link: "",
    description:
      "Plataforma que gera, em poucos cliques, milhares de variações de anúncios combinando criativos, headlines e copies, exportando diretamente para Google Ads Editor e Meta Ads Import.",
    technologies: ["React", "Shadcn UI", "TanStack Router"],
  },
];

export function Projects() {
  return (
    <section id="projects" className="text-neutral-400">
      <h2 className="text-2xl font-bold text-white mb-8">Projetos</h2>
      <div className="mt-8 flex flex-col gap-12">
        {projects.map((project) => (
          <a key={project.key} href={project.link} target="_blank">
            <article
              key={project.title}
              className={cn(
                "border-l-2 group hover:translate-x-2 border-neutral-700 pl-6 py-4 hover:border-neutral-300 ease-in-out transition-all duration-300",
                { "cursor-pointer": !!project?.link }
              )}
            >
              <h3 className="text-xl font-medium text-white flex items-center">
                {project.title}
                {/* {project?.link && (
                  <ExternalLinkIcon className="ml-2 group-hover:ml-3 group-hover:size-5 transition-all duration-300 ease-in-out" />
                )} */}
              </h3>
              <p className="mt-2">{project.description}</p>
              <div className="flex gap-2 mt-4">
                {project.technologies.map((tech) => (
                  <Tag key={tech} label={tech} />
                ))}
              </div>
            </article>
          </a>
        ))}
      </div>
    </section>
  );
}
