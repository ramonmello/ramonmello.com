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
          <li>
            <Link className="font-lores-12 font-normal" href="/blog">
              Blog
            </Link>
          </li>
          <li>
            <Link className="font-lores-12 font-normal" href="/game">
              Asteroids
            </Link>
          </li>
          {/* <li>
            <Link
              className="font-lores-12 font-normal"
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contato
            </Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
}
