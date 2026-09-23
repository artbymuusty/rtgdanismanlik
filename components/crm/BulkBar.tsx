"use client";

import { useState } from "react";
import { CRM_STATUSES } from "@/lib/crm/types";
import { crmErrorMessage } from "@/lib/crm/error-messages";
import { Button } from "@/components/ui/Button";

type Action = "sorumlu" | "durum" | "mentor" | null;

export function BulkBar({
  count,
  team,
  onApply,
  onExportCsv,
  onClear,
}: {
  count: number;
  team: string[];
  onApply: (changes: Record<string, string>) => Promise<{ ok: true; updated: number; failed: number } | { ok: false; error: string }>;
  onExportCsv: () => void;
  onClear: () => void;
}) {
  const [action, setAction] = useState<Action>(null);
  const [value, setValue] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function open(next: Action) {
    setAction(next === action ? null : next);
    setValue("");
    setConfirming(false);
    setResult(null);
  }

  async function apply() {
    if (!action || !value) return;
    setPending(true);
    const field = action === "sorumlu" ? "Sorumlu" : action === "durum" ? "Durum" : "Mentor ID";
    const r = await onApply({ [field]: value });
    setPending(false);
    setConfirming(false);
    if (r.ok) {
      // Success clears the selection in the parent, which unmounts this bar
      // immediately — the result is shown via the parent's toast instead
      // (see CrmWorkspace.handleBulkApply), not here.
      setAction(null);
    } else {
      setResult(crmErrorMessage(r.error));
    }
  }

  return (
    <div className="sticky bottom-0 z-20 border-t border-line bg-ink px-4 py-3 text-paper shadow-[0_-2px_8px_rgba(0,0,0,0.15)] motion-safe:animate-[crm-slide-up_150ms_ease-out]">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium">{count} kayıt seçildi</p>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => open("sorumlu")} className="rounded-[3px] border border-paper/30 px-3 py-1.5 text-xs hover:bg-paper/10">
            Sorumlu ata
          </button>
          <button type="button" onClick={() => open("durum")} className="rounded-[3px] border border-paper/30 px-3 py-1.5 text-xs hover:bg-paper/10">
            Durum değiştir
          </button>
          <button type="button" onClick={() => open("mentor")} className="rounded-[3px] border border-paper/30 px-3 py-1.5 text-xs hover:bg-paper/10">
            Mentor ata
          </button>
          <button type="button" onClick={onExportCsv} className="rounded-[3px] border border-paper/30 px-3 py-1.5 text-xs hover:bg-paper/10">
            CSV Aktar
          </button>
        </div>

        {action ? (
          <div className="flex items-center gap-2">
            {action === "sorumlu" ? (
              <select value={value} onChange={(e) => setValue(e.target.value)} className="rounded-[3px] border border-paper/30 bg-ink px-2 py-1.5 text-xs text-paper">
                <option value="">Sorumlu seç…</option>
                {team.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            ) : action === "durum" ? (
              <select value={value} onChange={(e) => setValue(e.target.value)} className="rounded-[3px] border border-paper/30 bg-ink px-2 py-1.5 text-xs text-paper">
                <option value="">Durum seç…</option>
                {CRM_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Mentor ID"
                className="rounded-[3px] border border-paper/30 bg-ink px-2 py-1.5 text-xs text-paper placeholder:text-paper/50"
              />
            )}

            {!confirming ? (
              <button type="button" disabled={!value} onClick={() => setConfirming(true)} className="rounded-[3px] bg-accent px-3 py-1.5 text-xs font-medium text-accent-ink disabled:opacity-40">
                Uygula
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-xs">
                {count} kayıt güncellenecek, emin misin?
                <button type="button" disabled={pending} onClick={apply} className="rounded-[3px] bg-danger px-2 py-1 font-medium text-paper">
                  {pending ? "Uygulanıyor..." : "Evet, uygula"}
                </button>
                <button type="button" onClick={() => setConfirming(false)} className="text-paper/70 hover:text-paper">
                  Vazgeç
                </button>
              </span>
            )}
          </div>
        ) : null}

        {result ? <p className="text-xs text-paper/80">{result}</p> : null}
        <Button variant="ghost" onClick={onClear} className="ml-auto !border-paper/40 !text-paper !px-3 !py-1.5 text-xs hover:!bg-paper/10">
          Seçimi temizle
        </Button>
      </div>
    </div>
  );
}
