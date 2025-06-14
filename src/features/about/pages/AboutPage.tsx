import { Sidebar } from "../ui/Sidebar";
import { Projects } from "../ui/Projects";
import { Experiences } from "../ui/Experiences";
import { AboutVM } from "../model/types";

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
