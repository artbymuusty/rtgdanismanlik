"use client";

import { useId, useRef, useState } from "react";
import { crmCreateAction } from "@/app/crm/actions";
import { crmErrorMessage } from "@/lib/crm/error-messages";
import type { CrmLead } from "@/lib/crm/types";
import { Button } from "@/components/ui/Button";
import { useDismiss } from "./hooks";

interface FormState {
  Ad: string;
  Soyad: string;
  Email: string;
  Telefon: string;
  Sorumlu: string;
  Notlar: string;
}
const EMPTY: FormState = { Ad: "", Soyad: "", Email: "", Telefon: "", Sorumlu: "", Notlar: "" };

/**
 * Manual lead entry — its OWN action (crmCreateAction / Code.gs's
 * crm_create), never the public website's submitLead flow. Always writes
 * Bizi Nereden Duydunuz = "Manuel giriş" and Durum = "İlk görüşme yapılmadı"
 * on the Apps Script side, so it enters the exact same CRM-first lifecycle
 * a real application would.
 */
export function NewLeadDialog({ team, onCreated, onClose }: { team: string[]; onCreated: (lead: CrmLead) => void; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // useId() is pure and stable for the component's lifetime — unlike
  // Date.now()/Math.random(), it's safe to call during render, and being
  // stable across re-renders (including a resubmit after a failed request)
  // is exactly what crm_create's idempotency-by-requestId wants.
  const requestId = useId().replace(/[^A-Za-z0-9_-]/g, "") + "-manual-lead";
  const dialogRef = useRef<HTMLDivElement>(null);
  useDismiss([dialogRef], onClose, true);

  const set = <K extends keyof FormState>(key: K, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.Ad.trim() || !form.Soyad.trim()) {
      setError("Ad ve soyad gerekli.");
      return;
    }
    if (!form.Email.trim() && !form.Telefon.trim()) {
      setError("E-posta veya telefon bilgilerinden en az biri gerekli.");
      return;
    }
    setPending(true);
    setError(null);
    const result = await crmCreateAction(form, requestId);
    setPending(false);
    if (!result.ok) {
      setError(crmErrorMessage(result.error));
      return;
    }
    if (result.row) onCreated(result.row);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Manuel lead ekle" className="w-full max-w-md rounded-[3px] border border-line bg-paper p-6 shadow-xl">
        <h2 className="font-display text-xl font-semibold text-ink">Manuel lead ekle</h2>
        <p className="mt-1 text-sm text-muted">Website başvurusu dışında, elle bir kayıt oluştur.</p>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ad" value={form.Ad} onChange={(v) => set("Ad", v)} required autoFocus />
            <Field label="Soyad" value={form.Soyad} onChange={(v) => set("Soyad", v)} required />
          </div>
          <Field label="E-posta" type="email" value={form.Email} onChange={(v) => set("Email", v)} />
          <Field label="Telefon" type="tel" value={form.Telefon} onChange={(v) => set("Telefon", v)} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Sorumlu</label>
            <select value={form.Sorumlu} onChange={(e) => set("Sorumlu", e.target.value)} className="w-full rounded-[3px] border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-accent">
              <option value="">Atanmadı</option>
              {team.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Not</label>
            <textarea
              rows={3}
              value={form.Notlar}
              onChange={(e) => set("Notlar", e.target.value)}
              className="w-full resize-none rounded-[3px] border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-accent"
            />
          </div>
          {error ? (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          ) : null}
          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose} className="!px-4 !py-2 text-sm">
              Vazgeç
            </Button>
            <Button type="submit" disabled={pending} className="!px-4 !py-2 text-sm">
              {pending ? "Oluşturuluyor..." : "Lead oluştur"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[3px] border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none focus-visible:border-accent"
      />
    </div>
  );
}
