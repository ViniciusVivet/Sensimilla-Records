import Link from "next/link";

export default function NotFound() {
  return (
    <div
      id="main-content"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-bg px-6 text-center text-fg"
    >
      <p className="font-display text-8xl text-accent/40">404</p>
      <h1 className="font-display text-3xl md:text-4xl">Página não encontrada</h1>
      <p className="max-w-md text-sm text-muted">
        O link pode estar errado ou o conteúdo foi movido.
      </p>
      <Link
        href="/"
        className="rounded-full border border-accent bg-accent px-8 py-3 text-sm font-semibold text-bg transition hover:opacity-90"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
