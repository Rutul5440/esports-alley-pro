import { cn } from "@/lib/utils";
import type { PlayerStats } from "@/types";
import { Target, Trophy, Crosshair, Activity, Zap, Award } from "lucide-react";

const items = [
  { key: "matches",     label: "Matches",       icon: Activity },
  { key: "wins",        label: "Wins",          icon: Trophy },
  { key: "kills",       label: "Kills",         icon: Crosshair },
  { key: "kd",          label: "K/D",           icon: Target },
  { key: "avgDamage",   label: "Avg Damage",    icon: Zap },
  { key: "headshotPct", label: "Headshot %",    icon: Award },
] as const;

export function StatsDisplay({ stats, className }: { stats: PlayerStats; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-3", className)}>
      {items.map(({ key, label, icon: Icon }) => {
        const v = stats[key];
        const display = key === "headshotPct" ? `${v}%` : v.toLocaleString();
        return (
          <div
            key={key}
            className="bg-gradient-surface border border-border rounded-lg p-4 flex items-start gap-3"
          >
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Icon size={18} />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-foreground">{display}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
