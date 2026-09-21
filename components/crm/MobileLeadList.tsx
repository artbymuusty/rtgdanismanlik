"use client";

import { enumLabel } from "@/lib/crm/fields";
import { formatCrmDate } from "@/lib/crm/format";
import type { CrmLead } from "@/lib/crm/types";
import { LevelBadge } from "./LevelBadge";
import { StatusBadge } from "./StatusSelect";
import { cn } from "@/lib/cn";

/** The phone/small-tablet substitute for DataTable: a card list, never a
 * squeezed-down spreadsheet. Tapping a card opens the same detail drawer,
 * which renders full-screen at this width (see LeadDrawer). */
export function MobileLeadList({
  rows,
  selected,
  onToggleSelect,
  onOpenLead,
}: {
  rows: CrmLead[];
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpenLead: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col divide-y divide-line">
      {rows.map((lead) => (
        <li key={lead.ID} className={cn("flex gap-3 px-4 py-3", selected.has(lead.ID) && "bg-accent/5")}>
          <input
            type="checkbox"
            aria-label={`${lead.Ad} ${lead.Soyad} seç`}
            checked={selected.has(lead.ID)}
            onChange={() => onToggleSelect(lead.ID)}
            className="mt-1 h-4 w-4 shrink-0 accent-accent"
          />
          <button type="button" onClick={() => onOpenLead(lead.ID)} className="min-w-0 flex-1 text-left">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-display text-base font-semibold text-ink">
                {lead.Ad} {lead.Soyad}
              </p>
              <span className="shrink-0 font-mono text-[10px] text-muted">{formatCrmDate(lead["Başvuru Tarihi"])}</span>
            </div>
            <p className="mt-0.5 truncate text-sm text-muted">{lead.Email || lead.Telefon}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <StatusBadge status={lead.Durum} />
              {lead["Aşama"] ? <span className="rounded-full border border-line px-2 py-0.5 text-xs text-ink">{enumLabel("Aşama", lead["Aşama"])}</span> : null}
              {lead["Almanca Seviyesi"] ? <LevelBadge column="Almanca Seviyesi" value={lead["Almanca Seviyesi"]} /> : null}
              {lead["İngilizce Seviyesi"] ? <LevelBadge column="İngilizce Seviyesi" value={lead["İngilizce Seviyesi"]} /> : null}
              {lead["Almanya Hedefi"] ? <LevelBadge column="Almanya Hedefi" value={lead["Almanya Hedefi"]} /> : null}
              {lead.Sorumlu ? <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">{lead.Sorumlu}</span> : null}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
