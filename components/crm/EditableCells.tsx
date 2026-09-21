"use client";

import { useEffect, useRef, useState } from "react";
import { useDismiss } from "./hooks";
import { cn } from "@/lib/cn";

export type CellSaveResult = { ok: true } | { ok: false; error: string };
export type CellSave = (value: string) => Promise<CellSaveResult>;

function useSaveState() {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  useEffect(() => {
    if (state !== "saved") return;
    const id = setTimeout(() => setState("idle"), 1500);
    return () => clearTimeout(id);
  }, [state]);
  return [state, setState] as const;
}

/** A short, click-to-edit text value (Mentor ID, İlk Görüşme Tarihi). Enter
 * or blur saves; Escape cancels back to the last saved value. */
export function InlineTextCell({ value, onSave, disabled, placeholder }: { value: string; onSave: CellSave; disabled?: boolean; placeholder?: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [state, setState] = useSaveState();
  const inputRef = useRef<HTMLInputElement>(null);

  // Adjust state during render (React's documented pattern for "derive from
  // a prop that changed") instead of an effect: keeps the field in sync with
  // a server-confirmed value without ever clobbering an in-progress edit.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue && !editing) {
    setLastValue(value);
    setDraft(value);
  }

  async function commit() {
    setEditing(false);
    if (draft === value) return;
    setState("saving");
    const result = await onSave(draft);
    if (result.ok) setState("saved");
    else {
      setState("error");
      setDraft(value);
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        autoFocus
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-[3px] border border-accent bg-paper px-1.5 py-1 text-xs text-ink outline-none"
      />
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      className={cn(
        "block w-full truncate rounded-[3px] px-1.5 py-1 text-left text-xs hover:bg-paper-raised disabled:cursor-not-allowed",
        value ? "text-ink" : "text-muted",
        state === "error" && "text-danger",
      )}
      title={value}
    >
      {value || placeholder || "—"}
    </button>
  );
}

/** An <select>-backed enum cell (Sorumlu, Aşama, Tercih Edilen İletişim) —
 * saves immediately on change, no separate edit mode needed. */
export function InlineSelectCell({
  value,
  options,
  onSave,
  disabled,
  emptyLabel = "—",
}: {
  value: string;
  options: { value: string; label: string }[];
  onSave: CellSave;
  disabled?: boolean;
  emptyLabel?: string;
}) {
  const [, setState] = useSaveState();
  const [pending, setPending] = useState(false);

  async function handleChange(next: string) {
    setPending(true);
    setState("saving");
    const result = await onSave(next);
    setPending(false);
    setState(result.ok ? "saved" : "error");
  }

  return (
    <select
      value={value}
      disabled={disabled || pending}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => handleChange(e.target.value)}
      className="w-full rounded-[3px] border border-transparent bg-transparent px-1.5 py-1 text-xs text-ink outline-none hover:border-line focus-visible:border-accent disabled:opacity-60"
    >
      <option value="">{emptyLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/** The Notlar cell: a short truncated preview in the table, a small
 * textarea popover for a quick edit without opening the full drawer.
 * Auto-saves on close if the draft changed; Escape discards. */
export function NotesCell({ value, onSave, disabled }: { value: string; onSave: CellSave; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [state, setState] = useSaveState();
  const ref = useRef<HTMLDivElement>(null);

  async function close(save: boolean) {
    setOpen(false);
    if (save && draft !== value) {
      setState("saving");
      const result = await onSave(draft);
      if (result.ok) setState("saved");
      else {
        setState("error");
        setDraft(value);
      }
    } else {
      setDraft(value);
    }
  }

  useDismiss([ref], () => close(true), open);

  const preview = value.replace(/\s+/g, " ").trim();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setDraft(value);
          setOpen(true);
        }}
        className={cn("block w-full truncate rounded-[3px] px-1.5 py-1 text-left text-xs hover:bg-paper-raised", preview ? "text-ink" : "italic text-muted")}
        title={preview}
      >
        {preview || "Not ekle..."}
      </button>
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-[3px] border border-line bg-paper p-2 shadow-lg" onClick={(e) => e.stopPropagation()}>
          <textarea
            autoFocus
            rows={4}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && close(false)}
            className="w-full resize-none rounded-[3px] border border-line bg-paper px-2 py-1.5 text-sm text-ink outline-none focus-visible:border-accent"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
              {state === "saving" ? "Kaydediliyor..." : state === "error" ? "Kaydedilemedi" : ""}
            </span>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => close(false)} className="rounded-[3px] px-2 py-1 text-xs text-muted hover:text-ink">
                Vazgeç
              </button>
              <button type="button" onClick={() => close(true)} className="rounded-[3px] bg-accent px-2 py-1 text-xs text-accent-ink hover:bg-ink">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
