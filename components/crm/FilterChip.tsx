"use client";

/** One removable pill — the reusable primitive behind the Toolbar's active-
 * filter row. Deliberately plain (no icon-only close button without a
 * label) so it reads correctly to a screen reader on its own. */
export function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-line bg-paper-raised py-1 pl-2.5 pr-1 text-xs text-ink">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`"${label}" filtresini kaldır`}
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
      >
        ×
      </button>
    </span>
  );
}
