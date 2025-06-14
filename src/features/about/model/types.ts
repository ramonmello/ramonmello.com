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
