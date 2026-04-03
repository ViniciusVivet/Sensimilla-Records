export default function Loading() {
  return (
    <div
      id="main-content"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-bg px-6 text-fg"
    >
      <div
        className="h-10 w-10 animate-pulse rounded-full border-2 border-accent/40 border-t-accent"
        aria-hidden
      />
      <p className="text-sm text-muted">Carregando…</p>
    </div>
  );
}
