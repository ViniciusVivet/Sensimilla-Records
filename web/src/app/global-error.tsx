"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          background: "#0a0a0a",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1.5rem",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Algo saiu do ritmo</h1>
        <p style={{ fontSize: "0.875rem", opacity: 0.6, maxWidth: 400 }}>
          Erro inesperado no site. Tente recarregar a página.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            background: "#c8f135",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "9999px",
            padding: "0.75rem 1.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
