import { Sidebar } from "@about/components/Sidebar";
import { Projects } from "@about/components/Projects";
import { Experiences } from "@about/components/Experiences";

export type AboutVM = {
  title: string;
  description?: string;
  experiences?: {
    role: string;
    company: string;
    startDate: string;
    currentJob: boolean;
    endDate?: string | null;
    contributions: string;
    tags?: Tag[] | null;
  }[];
  projects?: {
    name: string;
    link?: string;
    summary: string;
    tags?: Tag[];
  }[];
};

type Tag = {
  id: string;
  label: string;
};

export function AboutPage(data: AboutVM) {
  console.log("data ############# about page", data);
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
