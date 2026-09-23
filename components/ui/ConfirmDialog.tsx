import { cn } from "@/lib/cn";

/** Inline confirm step for an action already in progress (e.g. a bulk
 * update) — a question plus a confirm/cancel pair, not a full modal.
 * Generic (not CRM-specific): the caller supplies its own copy and decides
 * where to render it. `danger` picks the confirm button's tone (red for a
 * hard-to-reverse action, the accent color otherwise). */
export function ConfirmDialog({
  question,
  confirmLabel,
  cancelLabel = "Vazgeç",
  pending,
  pendingLabel = "Uygulanıyor...",
  onConfirm,
  onCancel,
  danger = true,
  className,
}: {
  question: string;
  confirmLabel: string;
  cancelLabel?: string;
  pending: boolean;
  pendingLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-1.5 text-xs", className)}>
      {question}
      <button
        type="button"
        disabled={pending}
        onClick={onConfirm}
        className={cn("rounded-[3px] px-2 py-1 font-medium text-paper disabled:opacity-60", danger ? "bg-danger" : "bg-accent")}
      >
        {pending ? pendingLabel : confirmLabel}
      </button>
      <button type="button" onClick={onCancel} className="text-paper/70 hover:text-paper">
        {cancelLabel}
      </button>
    </span>
  );
}
