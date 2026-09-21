"use client";

import { isoToday } from "@/lib/crm/query";
import { STATUS_NOT_MET, type CrmQuery } from "@/lib/crm/types";

type QuickQuery = Pick<CrmQuery, "search" | "filters" | "dateFilter">;

/**
 * A small "Bugün" (Today) working view — three reliably computable counts
 * (never a prediction or an AI guess), each one click away from the exact
 * filtered table it describes. Deliberately compact: a slim strip, not
 * another dashboard card.
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
    <div className="flex flex-wrap items-center gap-2 border-b border-line bg-paper-raised/50 px-4 py-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-gold">Bugün</span>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={() => onApply(item.query)}
          className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-ink transition-colors hover:border-accent"
        >
          <span className="font-mono font-semibold text-ink">{item.value}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
