import { Sidebar } from "../ui/Sidebar";
import { Projects } from "../ui/Projects";
import { Experiences } from "../ui/Experiences";

const aboutData = {
  experiences: [
    {
      role: "Front-end Developer",
      company: "Tod Space",
      startDate: new Date("2023-09-30T23:00:00.000Z"),
      currentJob: true,
      contributions:
        "Criação e teste de MVPs junto à equipe de produto, com foco na validação de ideias e melhoria contínua baseada no feedback dos usuários. Inclui o desenvolvimento de uma busca inteligente com Algolia que integrou cinco projetos diferentes em um único ambiente de conteúdo, oferecendo navegação semântica entre mais de 2000 artigos.",
      tags: [
        { id: "1", label: "React" },
        { id: "2", label: "Next.js" },
        { id: "3", label: "TailwindCSS" },
        { id: "4", label: "Algolia" },
      ],
    },
    {
      role: "Tech Lead",
      company: "Softo – DevTeam as a Service",
      startDate: new Date("2022-06-14T23:00:00.000Z"),
      currentJob: false,
      endDate: new Date("2023-10-14T23:00:00.000Z"),
      contributions:
        "* Discussões Técnicas: Além das atividades de desenvolvimento, participei ativamente de debates sobre processos de onboarding de clientes e estratégias para manter a qualidade do código.\n* Coordenação de Tarefas: Colaborei com a equipe de PM na distribuição de tarefas, assegurando que os projetos fossem executados de forma eficiente.\n* Avaliação de Equipe: Integrei os comitês de avaliação dos membros da equipe front-end, contribuindo para o desenvolvimento e integração dos novos colaboradores.",
      tags: [{ id: "1", label: "React" }],
    },
  ],
  projects: [
    {
      name: "Orbita",
      link: "https://www.orbita.press/fr",
      summary:
        "Hub de conteúdo do ecossistema Sens Public que centraliza\nartigos, notícias e eventos em um único domínio, usando busca\nsemântica Algolia para conectar temas e projetos.",
      tags: [
        { id: "2", label: "Next.js" },
        { id: "3", label: "TailwindCSS" },
        { id: "5", label: "Shadcn UI" },
        { id: "4", label: "Algolia" },
        { id: "6", label: "Radix UI" },
      ],
    },
    {
      name: "Game Engine 2D",
      link: "https://github.com/ramonmello/ramonmello.github.io/tree/main/src/features/engine",
      summary:
        "Projeto experimental que transforma páginas web em ambientes gamificados: o usuário navega como em um jogo, enquanto elementos da interface e do mundo 2D reagem de forma integrada, apagando a linha entre conteúdo e gameplay.",
      tags: [
        { id: "7", label: "TypeScript" },
        { id: "8", label: "WebGL" },
        { id: "9", label: "Canvas API" },
      ],
    },
  ],
};

const profileData = {
  avatar: "/ramon-avatar.jpg",
  name: "Ramon Mello",
  role: "Full Stack Developer",
  socials: [
    {
      platform: "github" as const,
      url: "https://github.com/ramonmello",
    },
    {
      platform: "linkedin" as const,
      url: "https://www.linkedin.com/in/ramonmello/",
    },
  ],
  bio: "Há mais de sete anos, projeto e desenvolvo interfaces que conectam estratégias de produto à experiência do usuário. Já liderei e colaborei com squads multidisciplinares, atuando como elo entre design, dados e negócios para converter insights em soluções rápidas, acessíveis e escaláveis. Mais do que escrever código, estudo a jornada e o comportamento dos usuários para validar hipóteses e embasar decisões técnicas, garantindo valor real para quem usa as soluções desenvolvidas.\n",
};

export function AboutPage() {
  return (
    <div className="max-w-6xl scroll-smooth mt-16">
      <div className="lg:flex lg:justify-between lg:gap-4">
        <Sidebar {...profileData} />
        <div className="w-full lg:w-7/12 text-neutral-400">
          <Projects projects={aboutData.projects} />
          <Experiences experiences={aboutData.experiences} />
        </div>
      </div>
    </div>
  );
}
