import Image from "next/image";

type Card = {
  key: string;
  featured: boolean;
  category: string;
  title: string;
  description: string;
};

const featuredCard: Card = {
  key: "a1b2c3d4e5",
  featured: true,
  category: "Front-end",
  title: "An Extraordinary WebGL Has Been Released By Great China Scientists",
  description:
    "Back in 2019, Gucci brought video games to its app with a new section called Gucci Arcade, inspired by creative director Alessandro Michele’s unique ability to combine the...",
};

const cards: Card[] = [
  {
    key: "f6g7h8i9j0",
    featured: false,
    category: "Back-end",
    title: "Simon Lizotte Take A Big Advance In The Last Tournament",
    description:
      "Back in 2019, Gucci brought video games to its app with a new section called Gucci Arcade, inspired by creative...",
  },
  {
    key: "k1l2m3n4o5",
    featured: false,
    category: "Back-end",
    title: "Simon Lizotte Take A Big Advance In The Last Tournament",
    description:
      "Back in 2019, Gucci brought video games to its app with a new section called Gucci Arcade, inspired by creative...",
  },
  {
    key: "p6q7r8s9t0",
    featured: false,
    category: "Back-end",
    title: "Simon Lizotte Take A Big Advance In The Last Tournament",
    description:
      "Back in 2019, Gucci brought video games to its app with a new section called Gucci Arcade, inspired by creative...",
  },
  {
    key: "u1v2w3x4y5",
    featured: false,
    category: "Back-end",
    title: "Simon Lizotte Take A Big Advance In The Last Tournament",
    description:
      "Back in 2019, Gucci brought video games to its app with a new section called Gucci Arcade, inspired by creative...",
  },
  {
    key: "z6a7b8c9d0",
    featured: false,
    category: "Back-end",
    title: "Simon Lizotte Take A Big Advance In The Last Tournament",
    description:
      "Back in 2019, Gucci brought video games to its app with a new section called Gucci Arcade, inspired by creative...",
  },
  {
    key: "e1f2g3h4i5",
    featured: false,
    category: "Back-end",
    title: "Simon Lizotte Take A Big Advance In The Last Tournament",
    description:
      "Back in 2019, Gucci brought video games to its app with a new section called Gucci Arcade, inspired by creative...",
  },
];

export default function Blog() {
  return (
    <>
      {/* <h1 className="text-3xl mb-8 md:mb-16 md:mt-20">Articles</h1> */}
      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 gap-12 lg:mt-14">
        <div className="flex max-w-[21rem] md:max-w-full flex-col lg:flex-row md:col-span-2 lg:col-span-3 cursor-pointer">
          <Image
            src="/image-tmp.avif"
            className="rounded-3xl mb-6 md:rounded-2xl w-full lg:w-auto lg:mb-0 lg:mr-12"
            alt="Blog Image"
            width={471}
            height={349}
          />
          <div className="p-2">
            <span className="text-sm md:text-base font-lores-12">
              {featuredCard.category}
            </span>
            <h1 className="text-lg md:text-[32px] font-bold leading-6 md:leading-10  mt-5 mb-6 md:mt-7 md:mb-8">
              {featuredCard.title}
            </h1>
            <p className="text-base text-neutral-400">
              {featuredCard.description}
            </p>
          </div>
        </div>
        {cards
          .filter((card) => !card.featured)
          .map((card) => (
            <div
              className="h-[27rem] max-w-[21rem] cursor-pointer"
              key={card.key}
            >
              <Image
                src="/image-tmp.avif"
                className="rounded-3xl mb-6 w-full"
                alt="Blog Image"
                width={321}
                height={249}
              />
              <div className="p-2">
                <span className="text-sm font-lores-12">{card.category}</span>
                <h2 className="text-lg font-bold leading-6 mt-5 mb-6">
                  {card.title}
                </h2>
                <p className="text-base text-neutral-400">{card.description}</p>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
