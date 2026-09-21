"use client";

import { forwardRef } from "react";
import { ActorBadge } from "./ActorBadge";
import { logout } from "@/app/crm/login/actions";

export const SearchInput = forwardRef<HTMLInputElement, { value: string; onChange: (v: string) => void }>(function SearchInput(
  { value, onChange },
  ref,
) {
  return (
    <input
      ref={ref}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Lead ara"
      placeholder="Ad, e-posta, telefon, ID, not, mesaj ara… ( / )"
      className="h-9 w-56 rounded-[3px] border border-line bg-paper px-3 text-sm text-ink outline-none focus-visible:border-accent sm:w-80"
    />
  );
});

/**
 * The header row: brand, global search, refresh, and the utility actions
 * (who's acting, logout) — the data-shaping actions (filter/sort/columns/
 * export/new lead) live one row down, in Toolbar, to keep this row about
 * "where am I and who am I" rather than crowding every control into one line.
 */
export function Topbar({
  search,
  onSearchChange,
  onRefresh,
  refreshing,
  searchRef,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  searchRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
      <p className="font-display text-lg font-semibold text-ink">RTG CRM</p>
      <SearchInput ref={searchRef} value={search} onChange={onSearchChange} />
      <button
        type="button"
        onClick={onRefresh}
        disabled={refreshing}
        className="flex h-9 items-center gap-1.5 rounded-[3px] border border-line px-3 text-sm text-ink transition-colors hover:border-accent disabled:opacity-60"
      >
        {refreshing ? "Yenileniyor..." : "Yenile"}
      </button>

      <div className="ml-auto flex items-center gap-2">
        <ActorBadge />
        <form action={logout}>
          <button type="submit" className="flex h-9 items-center rounded-[3px] border border-line px-3 text-sm text-muted transition-colors hover:border-danger hover:text-danger">
            Çıkış yap
          </button>
        </form>
      </div>
    </header>
  );
}
