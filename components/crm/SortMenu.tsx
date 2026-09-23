"use client";

import { useRef, useState } from "react";
import { CRM_COLUMNS, type CrmColumn, type SortDirection } from "@/lib/crm/types";
import { useDismiss, usePopoverPosition } from "./hooks";
import { cn } from "@/lib/cn";

/**
 * An explicit "Sırala" control, alongside (not instead of) click-to-sort
 * column headers in DataTable — the header click only works for a column
 * that's currently visible, so this is the only way to sort by a column
 * the user has hidden via Sütunlar without having to show it first.
 */
export function SortMenu({
  sortBy,
  sortDir,
  onChange,
}: {
  sortBy: CrmColumn;
  sortDir: SortDirection;
  onChange: (column: CrmColumn, dir: SortDirection) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useDismiss([ref], () => setOpen(false), open);
  const popoverStyle = usePopoverPosition(open, ref, panelRef);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-9 items-center gap-1.5 rounded-[3px] border border-line px-3 text-sm text-ink transition-colors hover:border-accent"
      >
        Sırala
        <span className="hidden text-xs text-muted sm:inline">
          {sortBy} {sortDir === "asc" ? "↑" : "↓"}
        </span>
      </button>

      {open ? (
        <div
          ref={panelRef}
          style={popoverStyle}
          role="listbox"
          aria-label="Sıralama sütunu"
          className="z-50 max-h-[70vh] w-64 max-w-[calc(100vw-24px)] overflow-y-auto rounded-[3px] border border-line bg-paper p-1.5 shadow-lg motion-safe:animate-[crm-scale-in_120ms_ease-out]"
        >
          <div className="flex gap-1 border-b border-line px-1.5 pb-1.5">
            {(["asc", "desc"] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => onChange(sortBy, dir)}
                className={cn(
                  "flex-1 rounded-[3px] px-2 py-1.5 text-xs font-medium",
                  sortDir === dir ? "bg-accent text-accent-ink" : "border border-line text-ink hover:border-accent",
                )}
              >
                {dir === "asc" ? "Artan ↑" : "Azalan ↓"}
              </button>
            ))}
          </div>
          <ul className="mt-1.5 flex flex-col">
            {CRM_COLUMNS.map((column) => (
              <li key={column}>
                <button
                  type="button"
                  role="option"
                  aria-selected={sortBy === column}
                  onClick={() => {
                    onChange(column, sortDir);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full truncate rounded-[3px] px-2 py-1.5 text-left text-sm hover:bg-paper-raised",
                    sortBy === column ? "font-medium text-accent" : "text-ink",
                  )}
                >
                  {column}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
