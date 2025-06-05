import { Sidebar } from "@about/components/Sidebar";
import { Projects } from "@about/components/Projects";
import { Experiences } from "@about/components/Experiences";

export default function AboutPage() {
  return (
    <div className="max-w-6xl scroll-smooth mt-16">
      <div className="lg:flex lg:justify-between lg:gap-4">
        <Sidebar />
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

          <Projects />
          <Experiences />
        </div>
      </div>
    </div>
  );
}
