import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="font-lores-12 text-5xl mb-9">
        404 - Página não encontrada
      </h1>
      <Link href="/">{"< voltar >"}</Link>
    </div>
  );
}
