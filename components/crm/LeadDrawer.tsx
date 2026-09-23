"use client";

import { useEffect, useState } from "react";
import { crmGetAction } from "@/app/crm/actions";
import { buildMailto, buildTel, buildWhatsAppLink, safeDriveLink } from "@/lib/crm/contact-links";
import { crmErrorMessage } from "@/lib/crm/error-messages";
import { ENUM_LABELS, FIELDS, GROUP_LABELS, type FieldGroup, type FieldMeta } from "@/lib/crm/fields";
import { formatCrmDate } from "@/lib/crm/format";
import type { ActivityEntry, CrmColumn, CrmLead, SnapshotInfo } from "@/lib/crm/types";
import { Button } from "@/components/ui/Button";
import type { CellSave } from "./EditableCells";
import { useFocusTrap } from "./hooks";
import { StatusBadge, StatusSelect } from "./StatusSelect";

const GROUP_ORDER: FieldGroup[] = ["personal", "application", "notes", "management"];

function DrawerField({ meta, value, onSave, statuses, team }: { meta: FieldMeta; value: string; onSave: CellSave; statuses: readonly string[]; team: string[] }) {
  const [draft, setDraft] = useState(value);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  // Adjust state during render instead of an effect (React's documented
  // pattern for "reset when the identity of what we're editing changes") —
  // LeadDrawer itself is remounted per lead (see key={lead.ID} at the call
  // site), so this only ever fires for a server-confirmed value of the SAME
  // lead, e.g. after saveField() resolves.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(value);
  }

  async function commit(next: string) {
    if (next === value) return;
    setState("saving");
    const result = await onSave(next);
    setState(result.ok ? "saved" : "error");
    if (!result.ok) setDraft(value);
  }

  const indicator =
    state === "saving" ? "Kaydediliyor..." : state === "saved" ? "Kaydedildi" : state === "error" ? "Kaydedilemedi" : null;

  const label = (
    <div className="mb-1.5 flex items-center justify-between">
      <span className="text-sm font-medium text-ink">{meta.column}</span>
      {indicator ? <span className={`font-mono text-[10px] uppercase tracking-[0.08em] ${state === "error" ? "text-danger" : "text-muted"}`}>{indicator}</span> : null}
    </div>
  );

  if (!meta.editable) {
    return (
      <div>
        {label}
        <p className="text-sm text-ink">{meta.column.includes("Tarihi") ? formatCrmDate(value) || "—" : value || "—"}</p>
      </div>
    );
  }

  if (meta.column === "Durum") {
    return (
      <div>
        {label}
        <StatusSelect value={value} statuses={statuses} firstMeetingDate={draft} onChange={commit} />
      </div>
    );
  }
  if (meta.column === "Sorumlu") {
    return (
      <div>
        {label}
        <select
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            commit(e.target.value);
          }}
          className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
        >
          <option value="">Atanmadı</option>
          {team.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    );
  }
  const enumOptions = ENUM_LABELS[meta.column];
  if (enumOptions) {
    return (
      <div>
        {label}
        <select
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            commit(e.target.value);
          }}
          className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
        >
          <option value="">Belirtilmedi</option>
          {Object.entries(enumOptions).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
    );
  }
  if (meta.multiline) {
    return (
      <div>
        {label}
        <textarea
          rows={meta.column === "Notlar" ? 5 : 3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          className="w-full resize-y rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
        />
      </div>
    );
  }
  return (
    <div>
      {label}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
        className="w-full rounded-[3px] border border-line bg-paper px-4 py-3 text-base text-ink outline-none focus-visible:border-accent sm:text-sm"
      />
    </div>
  );
}

function QuickAction({ href, children }: { href: string | null; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="rounded-[3px] border border-line px-3 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent">
      {children}
    </a>
  );
}

export function LeadDrawer({
  lead,
  statuses,
  team,
  onClose,
  onSave,
  onLeadRefreshed,
  position,
  onNavigate,
}: {
  lead: CrmLead;
  statuses: readonly string[];
  team: string[];
  onClose: () => void;
  onSave: (column: CrmColumn, value: string) => ReturnType<CellSave>;
  onLeadRefreshed: (lead: CrmLead) => void;
  /** Current row's position in the currently-loaded (filtered/sorted) page,
   * for the "← Önceki 3 / 12 Sonraki →" strip — omitted when the lead isn't
   * part of the visible rows (e.g. opened right after a create). */
  position?: { index: number; total: number } | null;
  onNavigate?: (direction: "prev" | "next") => void;
}) {
  const [snapshot, setSnapshot] = useState<SnapshotInfo | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // LeadDrawer is remounted per lead (key={lead.ID} at the call site — see
  // CrmWorkspace), so `snapshot`/`activity` already start at their initial
  // `null` for a newly opened lead; this effect only ever needs to fetch,
  // never to reset first.
  useEffect(() => {
    let cancelled = false;
    crmGetAction(lead.ID).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setLoadError(result.error);
        return;
      }
      setSnapshot(result.snapshot);
      setActivity(result.activity);
      if (result.row.version !== lead.version) onLeadRefreshed(result.row);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refetch only if a different lead mounts this component
  }, [lead.ID]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const mentorRef = lead["Mentor ID"].trim();
  const dialogRef = useFocusTrap<HTMLDivElement>(true);

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/30 motion-safe:animate-[crm-fade-in_150ms_ease-out]" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${lead.Ad} ${lead.Soyad} detayları`}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col overflow-hidden border-l border-line bg-paper shadow-2xl outline-none motion-safe:animate-[crm-slide-in-right_180ms_ease-out] sm:max-w-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-semibold text-ink">
              {lead.Ad} {lead.Soyad}
            </p>
            <StatusBadge status={lead.Durum} />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {position && onNavigate ? (
              <div className="flex items-center gap-1 rounded-[3px] border border-line text-sm text-ink">
                <button
                  type="button"
                  onClick={() => onNavigate("prev")}
                  disabled={position.index <= 0}
                  aria-label="Önceki lead"
                  className="rounded-l-[2px] px-2 py-1.5 hover:bg-paper-raised disabled:cursor-not-allowed disabled:opacity-30"
                >
                  ←
                </button>
                <span className="border-x border-line px-1.5 font-mono text-[11px] text-muted">
                  {position.index + 1} / {position.total}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate("next")}
                  disabled={position.index >= position.total - 1}
                  aria-label="Sonraki lead"
                  className="rounded-r-[2px] px-2 py-1.5 hover:bg-paper-raised disabled:cursor-not-allowed disabled:opacity-30"
                >
                  →
                </button>
              </div>
            ) : null}
            <button type="button" onClick={onClose} aria-label="Kapat" className="rounded-[3px] border border-line px-3 py-1.5 text-sm text-ink hover:border-accent">
              Kapat
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-line px-5 py-3">
          <QuickAction href={buildMailto(lead.Email)}>E-posta gönder</QuickAction>
          <QuickAction href={buildTel(lead.Telefon)}>Ara</QuickAction>
          <QuickAction href={buildWhatsAppLink(lead.Telefon)}>WhatsApp&apos;tan yaz</QuickAction>
          <QuickAction href={safeDriveLink(lead["Drive Folder"])}>Drive&apos;ı aç</QuickAction>
          {mentorRef ? (
            <span title="Mentor profili altyapısı hazır; henüz bir mentor dizini bağlanmadı." className="cursor-not-allowed rounded-[3px] border border-line px-3 py-2 text-sm text-muted opacity-60">
              Mentor profili ({mentorRef})
            </span>
          ) : null}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {GROUP_ORDER.map((group) => (
            <section key={group} className="mb-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{GROUP_LABELS[group]}</p>
              <div className="flex flex-col gap-4">
                {FIELDS.filter((f) => f.group === group).map((meta) => (
                  <DrawerField key={meta.column} meta={meta} value={lead[meta.column]} onSave={(v) => onSave(meta.column, v)} statuses={statuses} team={team} />
                ))}
              </div>
            </section>
          ))}

          {/* Kaynak: where the lead came from, plus the one-time LEADS_RAW
              snapshot fact — grouped together since both answer "where did
              this profile originate", never editable here. */}
          <section className="mb-6 rounded-[3px] border border-line bg-paper-raised p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-gold">{GROUP_LABELS.source}</p>
            <div className="mt-3 flex flex-col gap-3 text-sm">
              <div>
                <span className="mb-1 block text-xs font-medium text-muted">Bizi Nereden Duydunuz</span>
                <p className="text-ink">{lead["Bizi Nereden Duydunuz"] || "—"}</p>
              </div>
              {lead["Bizi Nereden Duydunuz"] === "Diğer" || snapshot?.sourceDetail ? (
                <div>
                  <span className="mb-1 block text-xs font-medium text-muted">Kaynak Detayı</span>
                  <p className="text-ink">{snapshot?.sourceDetail || "—"}</p>
                </div>
              ) : null}
              <div>
                <span className="mb-1 block text-xs font-medium text-muted">Başvuru Tarihi</span>
                <p className="text-ink">{formatCrmDate(lead["Başvuru Tarihi"]) || "—"}</p>
              </div>
              <div className="border-t border-line pt-3">
                {snapshot === null ? (
                  <p className="text-muted">Snapshot bilgisi yükleniyor...</p>
                ) : snapshot.exists ? (
                  <div className="space-y-1 text-ink">
                    <p>LEADS_RAW snapshot oluşturuldu{snapshot.date ? ` — ${formatCrmDate(snapshot.date)}` : ""}.</p>
                    {snapshot.legacy ? <p className="text-xs text-muted">Eski akışta, başvuru anında oluşturulmuş (legacy) — bağımsız yaşamaya devam ediyor.</p> : null}
                  </div>
                ) : (
                  <p className="text-muted">Snapshot henüz yok — Durum “İlk görüşme yapıldı” olduğunda bir kez oluşturulacak.</p>
                )}
              </div>
              <p className="break-all font-mono text-[10px] text-muted">
                {lead.ID}
                {snapshot?.source ? ` · ${snapshot.source}` : ""}
              </p>
            </div>
          </section>

          <section>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">Aktivite</p>
            {loadError ? (
              <p className="text-sm text-danger">{crmErrorMessage(loadError)}</p>
            ) : activity === null ? (
              <p className="text-sm text-muted">Yükleniyor...</p>
            ) : activity.length === 0 ? (
              <p className="text-sm text-muted">Henüz kayıtlı bir işlem yok.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {activity.map((entry, i) => (
                  <li key={i} className="text-xs text-muted">
                    <span className="text-ink">{entry.field}</span>
                    {entry.from || entry.to ? (
                      <>
                        : {entry.from || "—"} → {entry.to || "—"}
                      </>
                    ) : null}
                    <span className="block text-[10px]">
                      {formatCrmDate(entry.at)} · {entry.by}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="border-t border-line px-5 py-3">
          <Button variant="secondary" onClick={onClose} className="w-full !py-2.5 text-sm">
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
}
