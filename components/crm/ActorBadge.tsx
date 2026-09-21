"use client";

import { useRef, useState } from "react";
import { useLocalStorageState, useDismiss } from "./hooks";

const STORAGE_KEY = "rtg-crm-actor-v1";

/**
 * There is one shared CRM_ADMIN_SECRET, not per-person accounts, so there is
 * no login identity to attach to an audit entry. This lets whoever is at the
 * keyboard say who they are; it's sent as `actor` on every write (Code.gs
 * stores it in CRM_AUDIT's "Kullanıcı" column) — a courtesy label, never
 * used for authorization.
 */
export function useActorName(): [string, (v: string) => void] {
  return useLocalStorageState(STORAGE_KEY, "");
}

export function ActorBadge() {
  const [name, setName] = useActorName();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(name);
  const ref = useRef<HTMLDivElement>(null);
  useDismiss([ref], () => setOpen(false), open);

  function save() {
    setName(draft.trim());
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setDraft(name);
          setOpen((v) => !v);
        }}
        className="flex h-9 items-center gap-1.5 rounded-[3px] border border-line px-2.5 text-xs font-medium text-ink transition-colors hover:border-accent"
        title="Aktivite kaydında görünecek isim"
      >
        <span aria-hidden="true" className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-accent-ink">
          {(name || "?").trim().charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-[9rem] truncate sm:inline">{name || "İsim ekle"}</span>
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-[3px] border border-line bg-paper p-3 shadow-lg">
          <label htmlFor="actor-name" className="mb-1.5 block text-xs font-medium text-ink">
            Adın (aktivite kaydı için)
          </label>
          <input
            id="actor-name"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="ör. Ayşe K."
            autoFocus
            className="w-full rounded-[3px] border border-line bg-paper px-3 py-2 text-sm text-ink outline-none focus-visible:border-accent"
          />
          <button
            type="button"
            onClick={save}
            className="mt-2 w-full rounded-[3px] bg-accent px-3 py-1.5 text-xs font-medium text-accent-ink hover:bg-ink"
          >
            Kaydet
          </button>
        </div>
      ) : null}
    </div>
  );
}
