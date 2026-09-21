"use client";

import { FIELD_BY_COLUMN, enumLabel, ENUM_LABELS } from "@/lib/crm/fields";
import { formatCrmDate } from "@/lib/crm/format";
import type { CrmColumn, CrmLead, SortDirection } from "@/lib/crm/types";
import { InlineSelectCell, InlineTextCell, NotesCell, type CellSave } from "./EditableCells";
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
                <th key={column} className={cn("px-1.5 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-muted", WIDTH_CLASS[meta.width])}>
                  <button type="button" onClick={() => onSortChange(column)} className={cn("flex items-center gap-1 hover:text-ink", active && "text-ink")}>
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
            <tr key={lead.ID} className={cn("group cursor-pointer hover:bg-paper-raised", selected.has(lead.ID) && "bg-accent/5")} onClick={() => onOpenLead(lead.ID)}>
              <td className="sticky left-0 z-10 w-10 bg-paper px-2 py-1.5 group-hover:bg-paper-raised" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" aria-label={`${lead.Ad} ${lead.Soyad} seç`} checked={selected.has(lead.ID)} onChange={() => onToggleSelect(lead.ID)} className="h-4 w-4 accent-accent" />
              </td>
              {visibleColumns.map((column) => (
                <td key={column} className={cn("px-0 py-0.5", WIDTH_CLASS[FIELD_BY_COLUMN[column].width])} onClick={(e) => FIELD_BY_COLUMN[column].inlineEditable && e.stopPropagation()}>
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
