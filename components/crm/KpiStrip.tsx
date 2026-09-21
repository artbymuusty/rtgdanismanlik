import { STATUS_MET, STATUS_NOT_MET } from "@/lib/crm/types";
import type { StatusCounts } from "@/lib/crm/query";

function Stat({ label, value, tone }: { label: string; value: number; tone?: "muted" | "accent" | "gold" | "danger" }) {
  return (
    <div className="flex flex-col items-start px-3.5 py-2 first:pl-0">
      <span
        className={
          "font-mono text-lg font-semibold leading-none " +
          (tone === "accent" ? "text-accent" : tone === "gold" ? "text-gold" : tone === "danger" ? "text-danger" : "text-ink")
        }
      >
        {value}
      </span>
      <span className="mt-1 whitespace-nowrap text-[10px] uppercase tracking-[0.06em] text-muted">{label}</span>
    </div>
  );
}

/**
 * Compact live counters, its own thin strip below the header — never a
 * dashboard of large KPI cards. The table stays the main product; this is
 * a one-glance summary, not a destination in itself.
 */
export function KpiStrip({ counts }: { counts: StatusCounts }) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto border-b border-line px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center divide-x divide-line">
        <Stat label="Toplam" value={counts.total} />
        <Stat label="Bekleyen İlk Görüşme" value={counts.byStatus[STATUS_NOT_MET] ?? 0} tone="muted" />
        <Stat label="İlk Görüşme Yapılan" value={counts.byStatus[STATUS_MET] ?? 0} tone="accent" />
        <Stat label="Süreçte" value={counts.byStatus["Süreçte"] ?? 0} tone="gold" />
        <Stat label="Olumlu" value={counts.byStatus["Olumlu Sonuçlandı"] ?? 0} tone="accent" />
        <Stat label="Olumsuz" value={counts.byStatus["Olumsuz Sonuçlandı"] ?? 0} tone="danger" />
      </div>
    </div>
  );
}
