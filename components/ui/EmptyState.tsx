/** Generic centered empty/no-result state — a title, an optional
 * description, and an optional action (e.g. a "clear filters" button).
 * Not CRM-specific; any list/table view can reuse it. */
export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {description ? <p className="max-w-sm text-sm text-muted">{description}</p> : null}
      {action}
    </div>
  );
}
