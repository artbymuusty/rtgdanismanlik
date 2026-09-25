import { cn } from "@/lib/cn";

/**
 * Stands in for <EditorialPhoto> in exactly one case: this specific slot
 * (primary/secondary/tertiary) has no real, verified photo for this
 * university (see data/german-universities.ts's own doc comment on why —
 * a real photo was never forced in just to fill three slots). Unlike
 * EditorialPhoto's generic no-src placeholder (an abstract map-contour
 * graphic, meant for "no photo yet" across many unrelated components),
 * this one is a deliberate, honest information panel: it never tries to
 * look like a photograph, real or generated — no building silhouette, no
 * landscape gradient, no photographic framing — so it can never be
 * mistaken for an actual (if stylized) campus image. It surfaces the one
 * thing a real photo would have shown anyway: which university this is.
 */
export function UniversityImagePlaceholder({
  name,
  city,
  rankLabel,
  qsRank,
  unavailableLabel,
  ratio,
  className,
}: {
  name: string;
  city: string;
  rankLabel: string;
  qsRank: number;
  unavailableLabel: string;
  ratio: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2.5 overflow-hidden rounded-[3px] border border-line bg-paper-raised px-5 py-4 text-center",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      {/* Faint paper texture only — no ring/silhouette motif, so this
          reads unambiguously as an information card, not a photo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{ backgroundImage: "radial-gradient(var(--color-line) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />
      <div aria-hidden="true" className="absolute left-0 top-0 h-full w-[3px] bg-accent" />

      <span className="relative font-mono text-[9px] uppercase tracking-[0.14em] text-muted">{unavailableLabel}</span>
      <span className="relative line-clamp-2 font-display text-base font-semibold leading-tight text-ink">{name}</span>
      <span className="relative font-mono text-[11px] uppercase tracking-[0.06em] text-muted">
        {city} · {rankLabel} #{qsRank}
      </span>
    </div>
  );
}
