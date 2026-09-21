"use client";

import { STATUS_MET, STATUS_NOT_MET, type CrmStatus } from "@/lib/crm/types";
import { cn } from "@/lib/cn";

/**
 * The status dropdown, shared by the table cell and the detail drawer.
 * Outcome options are disabled (not hidden — the workflow stays visible)
 * until "İlk Görüşme Tarihi" is set, mirroring the exact rule Code.gs
 * enforces server-side (crmApplyChanges / onEdit). This is a UI convenience
 * only: the server re-checks the same rule regardless of what this renders.
 */
export function StatusSelect({
  value,
  statuses,
  firstMeetingDate,
  onChange,
  disabled,
  compact,
}: {
  value: string;
  statuses: readonly string[];
  firstMeetingDate: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const canReachOutcome = firstMeetingDate.trim() !== "" || value !== STATUS_NOT_MET;

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      title={!canReachOutcome ? `Önce “${STATUS_MET}” durumuna geçmelisin.` : undefined}
      className={cn(
        "w-full rounded-[3px] border border-line bg-paper text-ink outline-none focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-60",
        compact ? "px-2 py-1.5 text-xs" : "px-4 py-3 text-base sm:text-sm",
        value === STATUS_NOT_MET && "text-muted",
      )}
    >
      {statuses.map((status) => (
        <option key={status} value={status} disabled={status !== STATUS_NOT_MET && status !== STATUS_MET && !canReachOutcome}>
          {status}
        </option>
      ))}
    </select>
  );
}

export function statusTone(status: string): "muted" | "accent" | "gold" | "danger" {
  if (status === STATUS_NOT_MET) return "muted";
  if (status === STATUS_MET) return "accent";
  if (status === "Olumsuz Sonuçlandı") return "danger";
  return "gold";
}

export function StatusBadge({ status }: { status: string }) {
  const tone = statusTone(status);
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center truncate rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "muted" && "border-line text-muted",
        tone === "accent" && "border-accent/40 bg-accent/10 text-accent",
        tone === "gold" && "border-gold/40 bg-gold/10 text-gold",
        tone === "danger" && "border-danger/40 bg-danger/10 text-danger",
      )}
      title={status}
    >
      {status}
    </span>
  );
}

export type { CrmStatus };
