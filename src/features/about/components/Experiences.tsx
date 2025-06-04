const experience = [
  {
    title: "Front-end Developer",
    company: "TODSPACE",
    description:
      "Criação e teste de MVPs junto à equipe de produto, com foco na validação de ideias e melhoria contínua baseada no feedback dos usuários. Inclui o desenvolvimento de uma busca inteligente com Algolia que integrou cinco projetos diferentes em um único ambiente de conteúdo, oferecendo navegação semântica entre mais de 2 000 artigos.",
    technologies: ["React", "Next.js", "Algolia"],
    startDate: "2023-10",
    endDate: "Presente",
  },
  {
    title: "Tech Lead & Front-end Developer",
    company: "SOFTO – DevTeam as a Service",
    description:
      "Atuação técnica e liderança de times em projetos diversos, participando do desenho de soluções escaláveis, onboarding de novos devs, code review e comitês de performance.",
    technologies: ["React", "Next.js"],
    startDate: "2021-07",
    endDate: "2023-10",
  },
  {
    title: "Front-end Developer",
    company: "Farmácias APP (GrupoSC)",
    description:
      "Desenvolvimento e suporte ao sistema em produção, com contribuições estratégicas em decisões de produto e no roadmap técnico.",
    technologies: ["React", "Next.js"],
    startDate: "2021-02",
    endDate: "2021-08",
  },
  {
    title: "Full-stack Developer",
    company: "DRCHAT",
    description:
      "Entrega ágil de novas funcionalidades em uma plataforma de telemedicina, atuando full-stack com Node.js e Next.js.",
    technologies: ["Node.js", "Next.js"],
    startDate: "2020-03",
    endDate: "2021-02",
  },
  {
    title: "System Analyst & Estagiário",
    company: "DELAGE",
    description:
      "Suporte e desenvolvimento de sistemas logísticos, incluindo a criação de um aplicativo interno com React e React Native.",
    technologies: ["React", "React Native"],
    startDate: "2018-12",
    endDate: "2020-04",
  },
];

export function Experiences() {
  return (
    <section id="experience" className="pt-14 text-neutral-400">
      <h2 className="text-2xl font-bold text-white mb-8">Experiência</h2>
      {experience.map((job) => (
        <div
          key={job.company}
          className="border-l-2 border-neutral-700 pl-6 my-8 hover:border-neutral-300 transition-colors duration-300"
        >
          <h3 className="text-xl font-medium text-white">{job.title}</h3>
          <p className="text-lg">{job.company}</p>
          <p className="text-sm mt-1">
            {job.startDate.split("-")[0]} -{" "}
            {job.endDate === "Presente"
              ? job.endDate
              : job.endDate.split("-")[0]}
          </p>
          <p className="mt-2">{job.description}</p>
          <div className="flex gap-2 mt-4">
            {job.technologies.map((tech) => (
              <span
                key={tech}
                className="text-sm bg-neutral-800 px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
