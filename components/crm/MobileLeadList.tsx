"use client";

import { enumLabel } from "@/lib/crm/fields";
import { formatCrmDate } from "@/lib/crm/format";
import { buildMailto, buildTel, buildWhatsAppLink } from "@/lib/crm/contact-links";
import type { CrmLead } from "@/lib/crm/types";
import { Avatar } from "./Avatar";
import { LevelBadge } from "./LevelBadge";
import { StatusBadge } from "./StatusSelect";
import { cn } from "@/lib/cn";

/** Compact tap target for a phone/WhatsApp/e-mail quick action right on
 * the card — no need to open the full drawer just to reach for the
 * phone. `stopPropagation` keeps the tap from also opening the drawer. */
function CardQuickAction({ href, label, primary }: { href: string | null; label: string; primary?: boolean }) {
  if (!href) return null;
  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={cn(
        "flex h-8 items-center rounded-[3px] border px-2.5 text-xs font-medium transition-colors",
        primary ? "border-accent bg-accent text-accent-ink" : "border-line bg-paper text-ink",
      )}
    >
      {label}
    </a>
  );
}

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
      {rows.map((lead) => {
        const isSelected = selected.has(lead.ID);
        const prefersWhatsApp = lead["Tercih Edilen İletişim"] === "whatsapp";
        return (
          <li
            key={lead.ID}
            className={cn(
              "flex gap-3 border-l-2 px-4 py-3.5 transition-colors",
              isSelected ? "border-l-accent bg-accent/[0.06]" : "border-l-transparent",
            )}
          >
            <input
              type="checkbox"
              aria-label={`${lead.Ad} ${lead.Soyad} seç`}
              checked={isSelected}
              onChange={() => onToggleSelect(lead.ID)}
              className="mt-1 h-5 w-5 shrink-0 accent-accent"
            />
            <button type="button" onClick={() => onOpenLead(lead.ID)} className="min-w-0 flex-1 text-left">
              <div className="flex items-start gap-2.5">
                <Avatar firstName={lead.Ad} lastName={lead.Soyad} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-display text-base font-semibold text-ink">
                      {lead.Ad} {lead.Soyad}
                    </p>
                    <span className="shrink-0 font-mono text-[10px] text-muted">{formatCrmDate(lead["Başvuru Tarihi"])}</span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">{lead.Email || lead.Telefon}</p>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <StatusBadge status={lead.Durum} />
                {lead["Aşama"] ? <span className="rounded-full border border-line px-2 py-0.5 text-xs text-ink">{enumLabel("Aşama", lead["Aşama"])}</span> : null}
                {lead["Almanca Seviyesi"] ? <LevelBadge column="Almanca Seviyesi" value={lead["Almanca Seviyesi"]} /> : null}
                {lead["İngilizce Seviyesi"] ? <LevelBadge column="İngilizce Seviyesi" value={lead["İngilizce Seviyesi"]} /> : null}
                {lead["Almanya Hedefi"] ? <LevelBadge column="Almanya Hedefi" value={lead["Almanya Hedefi"]} /> : null}
                {lead.Sorumlu ? <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">{lead.Sorumlu}</span> : null}
              </div>

              {/* Quick actions right on the card — reaching for the phone
                  shouldn't require opening the full drawer first. */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <CardQuickAction href={buildTel(lead.Telefon)} label="Ara" primary={lead["Tercih Edilen İletişim"] === "phone"} />
                <CardQuickAction href={buildWhatsAppLink(lead.Telefon)} label="WhatsApp" primary={prefersWhatsApp} />
                <CardQuickAction href={buildMailto(lead.Email)} label="E-posta" />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
