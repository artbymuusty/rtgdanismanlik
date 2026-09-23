import { STATUS_MET, STATUS_NOT_MET, type CrmQuery } from "@/lib/crm/types";
import type { StatusCounts } from "@/lib/crm/query";

type QuickQuery = Pick<CrmQuery, "search" | "filters" | "dateFilter">;

export function Stat({
  label,
  value,
  tone,
  onClick,
  isPrimary,
}: {
  label: string;
  value: number;
  tone?: "muted" | "accent" | "gold" | "danger";
  onClick?: () => void;
  isPrimary?: boolean;
}) {
  const valueClass =
    "font-mono font-semibold leading-none " +
    (isPrimary ? "text-xl " : "text-lg ") +
    (tone === "accent" ? "text-accent" : tone === "gold" ? "text-gold" : tone === "danger" ? "text-danger" : "text-ink");
  const content = (
    <>
      <span className={valueClass}>{value}</span>
      <span className="mt-1 whitespace-nowrap text-[10px] uppercase tracking-[0.06em] text-muted">{label}</span>
    </>
  );
  if (!onClick) {
    return <div className="flex flex-col items-start px-3.5 py-2 first:pl-0">{content}</div>;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-start rounded-[3px] px-3.5 py-2 text-left transition-colors first:pl-0 hover:bg-paper-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      {content}
    </button>
  );
}

/**
 * Compact live counters, its own thin strip below the header — never a
 * dashboard of large KPI cards. The table stays the main product; this is
 * a one-glance summary, not a destination in itself. "Toplam" reads as the
 * primary number (slightly larger); the rest are secondary operational
 * counts, each one click away from the matching filtered view.
 */
export function KpiStrip({ counts, onApply }: { counts: StatusCounts; onApply: (query: QuickQuery) => void }) {
  const view = (filters: QuickQuery["filters"]): QuickQuery => ({ search: "", filters, dateFilter: undefined });
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto border-b border-line px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center divide-x divide-line">
        <Stat label="Toplam" value={counts.total} isPrimary onClick={() => onApply(view({}))} />
        <Stat label="Bekleyen İlk Görüşme" value={counts.byStatus[STATUS_NOT_MET] ?? 0} tone="muted" onClick={() => onApply(view({ Durum: [STATUS_NOT_MET] }))} />
        <Stat label="İlk Görüşme Yapılan" value={counts.byStatus[STATUS_MET] ?? 0} tone="accent" onClick={() => onApply(view({ Durum: [STATUS_MET] }))} />
        <Stat label="Süreçte" value={counts.byStatus["Süreçte"] ?? 0} tone="gold" onClick={() => onApply(view({ Durum: ["Süreçte"] }))} />
        <Stat label="Olumlu" value={counts.byStatus["Olumlu Sonuçlandı"] ?? 0} tone="accent" onClick={() => onApply(view({ Durum: ["Olumlu Sonuçlandı"] }))} />
        <Stat label="Olumsuz" value={counts.byStatus["Olumsuz Sonuçlandı"] ?? 0} tone="danger" onClick={() => onApply(view({ Durum: ["Olumsuz Sonuçlandı"] }))} />
      </div>
    </div>
  );
}
