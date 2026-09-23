"use client";

import { isoToday } from "@/lib/crm/query";
import { STATUS_NOT_MET, type CrmQuery } from "@/lib/crm/types";
import { Stat } from "./KpiStrip";

type QuickQuery = Pick<CrmQuery, "search" | "filters" | "dateFilter">;

/**
 * A small "Bugün" (Today) working view — three reliably computable counts
 * (never a prediction or an AI guess), each one click away from the exact
 * filtered table it describes. Reuses KpiStrip's own <Stat> primitive (same
 * number-over-caption rhythm, same divider/spacing) so this strip reads as
 * a continuation of the KPI strip above it — a "today" slice of the same
 * metrics language — rather than a visually unrelated row of chips.
 */
export function TodayPanel({
  appliedToday,
  awaitingFirstMeeting,
  metToday,
  onApply,
}: {
  appliedToday: number;
  awaitingFirstMeeting: number;
  metToday: number;
  onApply: (query: QuickQuery) => void;
}) {
  const today = isoToday();
  const items: { label: string; value: number; query: QuickQuery }[] = [
    {
      label: "Bugün gelen başvurular",
      value: appliedToday,
      query: { search: "", filters: {}, dateFilter: { column: "Başvuru Tarihi", from: today, to: today } },
    },
    {
      label: "İlk görüşme bekleyenler",
      value: awaitingFirstMeeting,
      query: { search: "", filters: { Durum: [STATUS_NOT_MET] }, dateFilter: undefined },
    },
    {
      label: "Bugün ilk görüşme yapılanlar",
      value: metToday,
      query: { search: "", filters: {}, dateFilter: { column: "İlk Görüşme Tarihi", from: today, to: today } },
    },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto border-b border-line bg-paper-raised/40 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-gold">Bugün</span>
      <div className="flex items-center divide-x divide-line">
        {items.map((item) => (
          <Stat key={item.label} label={item.label} value={item.value} onClick={() => onApply(item.query)} />
        ))}
      </div>
    </div>
  );
}
