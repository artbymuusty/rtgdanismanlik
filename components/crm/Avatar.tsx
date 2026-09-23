import { cn } from "@/lib/cn";

function initials(firstName: string, lastName: string): string {
  const a = firstName.trim().charAt(0);
  const b = lastName.trim().charAt(0);
  return (a + b).toUpperCase() || "—";
}

/**
 * Initials badge — RTG's own editorial palette (paper-raised + ink border),
 * never a colorful per-person "generic SaaS" avatar. Purely a scanning aid
 * for the table's identity cell and the drawer header; carries no data of
 * its own, so it's safe to render before a lead's full record has loaded.
 */
export function Avatar({ firstName, lastName, size = "sm" }: { firstName: string; lastName: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-line bg-paper-raised font-mono font-medium text-ink",
        size === "sm" ? "h-7 w-7 text-[11px]" : "h-10 w-10 text-sm",
      )}
    >
      {initials(firstName, lastName)}
    </span>
  );
}
