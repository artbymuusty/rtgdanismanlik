"use client";

import { BADGE_COLUMNS, FIELD_BY_COLUMN, enumLabel, ENUM_LABELS } from "@/lib/crm/fields";
import { formatCrmDate } from "@/lib/crm/format";
import type { CrmColumn, CrmLead, SortDirection } from "@/lib/crm/types";
import { InlineSelectCell, InlineTextCell, NotesCell, type CellSave } from "./EditableCells";
import { Avatar } from "./Avatar";
import { LevelBadge } from "./LevelBadge";
import { StatusSelect } from "./StatusSelect";
import { cn } from "@/lib/cn";

const WIDTH_CLASS: Record<string, string> = {
  xs: "min-w-[84px]",
  sm: "min-w-[128px]",
  md: "min-w-[176px]",
  lg: "min-w-[220px]",
  xl: "min-w-[280px]",
};

function toOptions(map: Record<string, string> | undefined): { value: string; label: string }[] {
  return Object.entries(map ?? {}).map(([value, label]) => ({ value, label }));
}

export function DataTable({
  rows,
  visibleColumns,
  sortBy,
  sortDir,
  onSortChange,
  selected,
  onToggleSelect,
  onToggleSelectAll,
  onOpenLead,
  onCellSave,
  team,
  statuses,
}: {
  rows: CrmLead[];
  visibleColumns: CrmColumn[];
  sortBy: CrmColumn;
  sortDir: SortDirection;
  onSortChange: (column: CrmColumn) => void;
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onOpenLead: (id: string) => void;
  onCellSave: (lead: CrmLead, column: CrmColumn, value: string) => ReturnType<CellSave>;
  team: string[];
  statuses: string[];
}) {
  const allOnPageSelected = rows.length > 0 && rows.every((r) => selected.has(r.ID));
  const teamOptions = team.map((name) => ({ value: name, label: name }));

  function renderCell(lead: CrmLead, column: CrmColumn) {
    const save = (value: string) => onCellSave(lead, column, value);
    switch (column) {
      case "Ad":
        // The identity cell: avatar + Ad Soyad (primary, bold) + Email
        // (secondary, muted) — isim/email/source/ID artık tek bir okunaklı
        // hiyerarşi içinde. Soyad/Email remain their own real columns
        // (sortable/filterable/searchable, toggle-able in Sütunlar) — this
        // is purely how "Ad" itself renders when visible.
        return (
          <div className="flex min-w-0 items-center gap-2 px-1.5 py-1">
            <Avatar firstName={lead.Ad} lastName={lead.Soyad} />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-ink">
                {lead.Ad} {lead.Soyad}
              </p>
              {lead.Email ? <p className="truncate text-[11px] text-muted">{lead.Email}</p> : null}
            </div>
          </div>
        );
      case "Durum":
        return (
          <StatusSelect value={lead.Durum} statuses={statuses} firstMeetingDate={lead["İlk Görüşme Tarihi"]} onChange={save} compact />
        );
      case "Sorumlu":
        return <InlineSelectCell value={lead.Sorumlu} options={teamOptions} onSave={save} emptyLabel="Atanmadı" />;
      case "Aşama":
        return <InlineSelectCell value={lead["Aşama"]} options={toOptions(ENUM_LABELS["Aşama"])} onSave={save} />;
      case "Tercih Edilen İletişim":
        return <InlineSelectCell value={lead[column]} options={toOptions(ENUM_LABELS[column])} onSave={save} />;
      case "Notlar":
        return <NotesCell value={lead.Notlar} onSave={save} />;
      case "Mentor ID":
        return <InlineTextCell value={lead["Mentor ID"]} onSave={save} placeholder="Atanmadı" />;
      case "İlk Görüşme Tarihi":
        return <InlineTextCell value={lead[column]} onSave={save} placeholder="—" />;
      case "Başvuru Tarihi":
        return <span className="block truncate px-1.5 py-1 text-xs text-muted">{formatCrmDate(lead[column])}</span>;
      case "ID":
        return <span className="block truncate px-1.5 py-1 font-mono text-[11px] text-muted">{lead.ID}</span>;
      default: {
        if (BADGE_COLUMNS[column]) {
          return (
            <span className="block px-1.5 py-1">
              <LevelBadge column={column} value={lead[column]} />
            </span>
          );
        }
        const display = enumLabel(column, lead[column]);
        return (
          <span className="block truncate px-1.5 py-1 text-xs text-ink" title={display}>
            {display || <span className="text-muted">—</span>}
          </span>
        );
      }
    }
  }

  return (
    <div className="h-full overflow-auto">
      <table className="w-full min-w-max border-collapse text-left text-sm">
        <thead className="sticky top-0 z-20 bg-paper shadow-[0_1px_0_var(--color-line)]">
          <tr>
            <th className="sticky left-0 z-30 w-10 bg-paper px-2 py-2">
              <input type="checkbox" aria-label="Sayfadaki tümünü seç" checked={allOnPageSelected} onChange={onToggleSelectAll} className="h-4 w-4 accent-accent" />
            </th>
            {visibleColumns.map((column) => {
              const meta = FIELD_BY_COLUMN[column];
              const active = sortBy === column;
              return (
                <th
                  key={column}
                  scope="col"
                  aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
                  className={cn("px-1.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-muted", WIDTH_CLASS[meta.width])}
                >
                  <button
                    type="button"
                    onClick={() => onSortChange(column)}
                    aria-label={`${column} sütununa göre sırala${active ? `, şu an ${sortDir === "asc" ? "artan" : "azalan"}` : ""}`}
                    className={cn("flex items-center gap-1 hover:text-ink", active && "text-ink")}
                  >
                    <span className="truncate">{column}</span>
                    {active ? <span aria-hidden="true">{sortDir === "asc" ? "▲" : "▼"}</span> : null}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((lead) => (
            <tr
              key={lead.ID}
              tabIndex={0}
              aria-selected={selected.has(lead.ID)}
              aria-label={`${lead.Ad} ${lead.Soyad} detaylarını aç`}
              onClick={() => onOpenLead(lead.ID)}
              onKeyDown={(e) => {
                if (e.target !== e.currentTarget) return; // let inline inputs/selects handle their own keys
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenLead(lead.ID);
                }
              }}
              className={cn(
                "group cursor-pointer transition-colors hover:bg-paper-raised focus-visible:bg-paper-raised focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent",
                selected.has(lead.ID) && "bg-accent/[0.06]",
              )}
            >
              <td
                className={cn(
                  "sticky left-0 z-10 w-10 border-l-2 bg-paper px-2 py-2 transition-colors group-hover:bg-paper-raised",
                  selected.has(lead.ID) ? "border-l-accent bg-accent/[0.06] group-hover:bg-accent/[0.08]" : "border-l-transparent",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <input type="checkbox" aria-label={`${lead.Ad} ${lead.Soyad} seç`} checked={selected.has(lead.ID)} onChange={() => onToggleSelect(lead.ID)} className="h-4 w-4 accent-accent" />
              </td>
              {visibleColumns.map((column) => (
                <td key={column} className={cn("px-0 py-1", WIDTH_CLASS[FIELD_BY_COLUMN[column].width])} onClick={(e) => FIELD_BY_COLUMN[column].inlineEditable && e.stopPropagation()}>
                  {renderCell(lead, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
