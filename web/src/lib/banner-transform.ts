export type CoverTransform = { zoom: number; x: number; y: number };

export function parseCoverTransform(input?: string): CoverTransform {
  const fallback: CoverTransform = { zoom: 1, x: 0, y: 0 };
  if (!input) return fallback;
  try {
    const parsed = JSON.parse(input) as Partial<CoverTransform>;
    const zoom = typeof parsed.zoom === "number" ? parsed.zoom : fallback.zoom;
    const x = typeof parsed.x === "number" ? parsed.x : fallback.x;
    const y = typeof parsed.y === "number" ? parsed.y : fallback.y;
    return {
      zoom: Number.isFinite(zoom) ? Math.min(3, Math.max(0.5, zoom)) : fallback.zoom,
      x: Number.isFinite(x) ? Math.min(80, Math.max(-80, x)) : fallback.x,
      y: Number.isFinite(y) ? Math.min(80, Math.max(-80, y)) : fallback.y,
    };
  } catch {
    return fallback;
  }
}
