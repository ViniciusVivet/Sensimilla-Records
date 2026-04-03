/**
 * URL canônica do site (sem barra final).
 * Defina em produção: NEXT_PUBLIC_SITE_URL=https://seudominio.com
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
