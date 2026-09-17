import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li" | "article";
}) {
  return (
    <Tag className={cn("rounded-[3px] border border-line bg-paper-raised p-6", className)}>
      {children}
    </Tag>
  );
}
