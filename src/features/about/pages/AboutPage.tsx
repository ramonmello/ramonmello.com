import { Sidebar } from "@about/components/Sidebar";
import { Projects } from "@about/components/Projects";
import { Experiences } from "@about/components/Experiences";

export function AboutPage({ data }: { data: any }) {
  return (
    <div className="max-w-6xl scroll-smooth mt-16">
      <div className="lg:flex lg:justify-between lg:gap-4">
        <Sidebar />
        <div className="w-full lg:w-7/12 text-neutral-400">
          <Projects />
          <Experiences />
        </div>
      </div>
    </div>
  );
}
