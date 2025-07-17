import Link from "next/link";

export function Header() {
  return (
    <header className="w-full">
      <nav className="text-white">
        <ul className="flex gap-4">
          <li>
            <Link className="font-lores-12 font-normal" href="/">
              Início
            </Link>
          </li>
          <li>
            <Link className="font-lores-12 font-normal" href="/about">
              Sobre
            </Link>
          </li>
          {/* <li>
            <Link className="font-lores-12 font-normal" href="/blog">
              Blog
            </Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}
