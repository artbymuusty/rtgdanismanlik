import { BADGE_COLUMNS, enumLabel } from "@/lib/crm/fields";
import type { CrmColumn } from "@/lib/crm/types";
import { cn } from "@/lib/cn";

/**
 * A compact "Lead Intelligence" pill for the table/cards (İngilizce Seviyesi,
 * Almanca Seviyesi, Almanya Hedefi, Zaman Çizelgesi) — a short prefix plus
 * the human label, e.g. "DE B2", "Hedef Master". Purely a display choice:
 * the stored value is exactly what enumLabel() already resolves elsewhere,
 * never altered here. Text-based, not color-only, so it reads fine without
 * relying on the accent tint.
 */
export function LevelBadge({ column, value, className }: { column: CrmColumn; value: string; className?: string }) {
  if (!value) return <span className="text-muted">—</span>;
  const prefix = BADGE_COLUMNS[column];
  const label = enumLabel(column, value);
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1 truncate rounded-[3px] border border-line bg-paper-raised px-1.5 py-0.5 text-[11px] font-medium text-ink",
        className,
      )}
      title={label}
    >
      {prefix ? <span className="text-muted">{prefix}</span> : null}
      <span className="truncate">{label}</span>
    </span>
  );
}
