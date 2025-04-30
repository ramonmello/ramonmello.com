import Image from "next/image";

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

const projects = [
  {
    title: "Orbita",
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
    title: "Engine 2D (nome provisório, aceito sugestões!)",
    description:
      "Projeto experimental que transforma páginas web em ambientes gamificados: o usuário navega como em um jogo, enquanto elementos da interface e do mundo 2D reagem de forma integrada, apagando a linha entre conteúdo e gameplay.",
    technologies: ["Canvas API", "WebGL", "Typescript"],
  },
  {
    title: "Synkinator",
    description:
      "Ferramenta em desenvolvimento que automatiza o processo de ingest de fotos e vídeos, permitindo fluxos personalizados de importação, organização e backup para fotógrafos e videomakers.",
    technologies: ["React", "Tauri", "TanStack Router"],
  },
  {
    title: "Crigo",
    description:
      "Plataforma que gera, em poucos cliques, milhares de variações de anúncios combinando criativos, headlines e copies, exportando diretamente para Google Ads Editor e Meta Ads Import.",
    technologies: ["React", "Shadcn UI", "TanStack Router"],
  },
];

const avatarBlurDataURL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAAoACgDASIAAhEBAxEB/8QAGwAAAgIDAQAAAAAAAAAAAAAAAAUGBwECBAP/xAAsEAABAwMCBAUEAwAAAAAAAAABAgMEAAURBiESMUFRBxMiYYEUMnGRFUKh/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAMCBAj/xAAeEQACAgIDAQEAAAAAAAAAAAAAAQIRAyESMUEiUf/aAAwDAQACEQMRAD8AuWiiigAUrumcMxHUmVIDEYHCCFcSj+qAcnFLtU63g6dZSh1D0uWvPkx2xla8dSf6pHc8mqo1JrG9XuSt+VcpKGicpYZcUlCB2CQcbdzkntTjByFyRbb13tjIIRJdfUOYYaU4R8A4+aRzfETT0VRSjz5RAyQwylQP5VgfvFQRgr8sLfcUtfJJBIHYbbUsrLGjN8nQuTTEyZ4v3IqP8fbmGwTgGQ4VEfCcD9Zp7Z9dWK5uBhcgxZB/q6MJJ9lA4B9iRnsar6xad+pcLspXFw7hJGAkdSfYUznWJcWKpRWVLCFYKkYCnCduFI5kHmew61WVqKSEXbo9G6KRaP1HDv8ADQ40UszGA2HpCEEBeMkBYPJQycHBwOYyM00qLTT2VCDWdwlMWdluG+WJVT5JZKSEJ7EnOQrO4IGTVc26OqHFSl+UpceRy5Yk/JwkD8D3qz9ZWf8AmLK7CWvynN0OgcoqdlgHt90d1H3qq7VGdNzts6UylXl7uvDKyOXCjc4GMnY7dxuMxWC+V8kRzdnK2S6vRxuP5n5qZTXGnXHwxU8pRkL/AJvvX8/6KK2KNFNn/9k=";

export default function About() {
  return (
    <div className="max-w-6xl scroll-smooth mt-16">
      <div className="lg:flex lg:justify-between lg:gap-4">
        <div className="mb-11 md:mb-0 lg:sticky lg:h-[calc(100vh-345px)] lg:flex lg:flex-col top-36 w-full lg:w-6/12">
          <Image
            src="/ramon-avatar.jpg"
            alt="Ramon Mello - Front-end Developer"
            width={250}
            height={250}
            className="mb-10 rounded-3xl"
            priority={true}
            placeholder="blur"
            blurDataURL={avatarBlurDataURL}
            sizes="(max-width: 768px) 100vw, 250px"
          />
          <h1 className="font-bold text-5xl">Ramon Mello</h1>
          <p className="text-xl">Front-end Developer</p>
          <p className="mt-4 text-base text-neutral-400">
            Desenvolvedor Front-end especializado em criar experiências web
            modernas e interativas.
          </p>
          <nav className="mt-8" aria-label="Main navigation">
            <ul className="space-y-2 uppercase font-lores-12">
              <li>
                <a
                  href="#"
                  className="hover:text-neutral-300 transition-colors duration-300"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="hover:text-neutral-300 transition-colors duration-300"
                >
                  Projetos
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className="hover:text-neutral-300 transition-colors duration-300"
                >
                  Experiência
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="w-full lg:w-7/12 text-neutral-400">
          <section className="text-neutral-400">
            <h2 className="sr-only" id="about">
              Sobre mim
            </h2>
            <p>
              Há mais de sete anos, projeto e desenvolvo interfaces que conectam
              estratégias de produto à experiência do usuário. Já liderei e
              colaborei com squads multidisciplinares, atuando como elo entre
              design, dados e negócios para converter insights em soluções
              rápidas, acessíveis e escaláveis. Mais do que escrever código,
              estudo a jornada e o comportamento dos usuários para validar
              hipóteses e embasar decisões técnicas, garantindo valor real para
              quem usa as soluções desenvolvidas.
            </p>
          </section>
          <section id="projects" className="text-neutral-400">
            <h2 className="text-2xl font-bold text-white pt-14 mb-8">
              Projetos
            </h2>
            <div className="mt-8 flex flex-col gap-12">
              {projects.map((project) => (
                <article
                  key={project.title}
                  className="border-l-2 border-neutral-700 pl-6 py-4 hover:border-neutral-300 transition-colors duration-300"
                >
                  <h3 className="text-xl font-medium text-white">
                    {project.title}
                  </h3>
                  <p className="mt-2">{project.description}</p>
                  <div className="flex gap-2 mt-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-sm bg-neutral-800 px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
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
        </div>
      </div>
    </div>
  );
}
