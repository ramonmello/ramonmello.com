import Image from "next/image";

export function DefaultFooter() {
  return (
    <footer className="flex self-end w-full">
      <div className="flex ml-auto">
        <a
          className="flex mr-4"
          href="https://github.com/ramonmello"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            className="text-amber-200 fill-amber-200"
            src="/github-icon.svg"
            alt="File icon"
            width={24}
            height={24}
          />
        </a>
        <a
          className="flex"
          href="https://www.linkedin.com/in/ramonmello/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/linkedin-icon.svg"
            alt="File icon"
            width={24}
            height={24}
          />
        </a>
      </div>
    </footer>
  );
}
