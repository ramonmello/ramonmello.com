import { Tag } from "@shared/components/ui/Tag";
import type { Experience } from "../model/types";

type Props = {
  experiences: Experience[];
};

export function Experiences(props: Props) {
  const { experiences } = props;
  return (
    <section id="experience" className="pt-14 text-neutral-400">
      <h2 className="text-2xl font-bold text-white mb-8">Experiência</h2>
      {experiences.map((exp) => (
        <div
          key={`${exp.company}-${exp.role}`}
          className="border-l-2 border-neutral-700 pl-6 my-8 hover:border-neutral-300 transition-colors duration-300"
        >
          <h3 className="text-xl font-medium text-white w-fit bg-black">
            {exp.role}
          </h3>
          <p className="text-lg w-fit bg-black">{exp.company}</p>
          <p className="text-lg mt-1 w-fit bg-black">
            <EmploymentPeriod
              currentJob={exp.currentJob}
              startDate={exp.startDate}
              endDate={exp.endDate}
            />
          </p>
          <p className="mt-2 bg-black">{exp.contributions}</p>
          <div className="flex gap-2 mt-4">
            {exp.tags.map((tag) => (
              <Tag key={tag.id} label={tag.label} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function EmploymentPeriod(props: {
  currentJob: boolean;
  startDate: Date;
  endDate?: Date;
}) {
  const { currentJob, startDate, endDate } = props;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    });
  };

  if (currentJob) {
    return `${formatDate(startDate)} - Presente`;
  }

  if (!endDate) {
    throw new Error("End date is required for non-current jobs");
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}
