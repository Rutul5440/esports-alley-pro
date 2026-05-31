import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";

const toneByLabel: Record<string, string> = {
  Rookie: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  Contender: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  Elite: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  Master: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Conqueror: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

export function BadgeChip({ label, icon = true, className }: { label: string; icon?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold", toneByLabel[label] || "border-border bg-accent/30 text-muted-foreground", className)}>
      {icon && <Medal size={13} />}
      {label}
    </span>
  );
}
