import { cn } from "@/lib/utils";
import { Crown, Shield, Trophy, Swords, Award, Star } from "lucide-react";
import type { Rank } from "@/types";

const config: Record<Rank, { color: string; icon: typeof Crown; label: string }> = {
  Bronze: { color: "var(--rank-bronze)", icon: Shield, label: "Bronze" },
  Silver: { color: "var(--rank-silver)", icon: Shield, label: "Silver" },
  Gold: { color: "var(--rank-gold)", icon: Award, label: "Gold" },
  Platinum: { color: "var(--rank-platinum)", icon: Star, label: "Platinum" },
  Diamond: { color: "var(--rank-diamond)", icon: Star, label: "Diamond" },
  Crown: { color: "var(--rank-crown)", icon: Crown, label: "Crown" },
  Ace: { color: "var(--rank-ace)", icon: Swords, label: "Ace" },
  Conqueror: { color: "var(--rank-conqueror)", icon: Trophy, label: "Conqueror" },
};

interface Props {
  rank: Rank;
  tier?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RankBadge({ rank, tier, size = "md", className }: Props) {
  const { color, icon: Icon, label } = config[rank];
  const sizes = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-2.5 py-1 gap-1.5",
    lg: "text-base px-3 py-1.5 gap-2",
  };
  const iconSize = { sm: 12, md: 14, lg: 18 }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold font-display uppercase tracking-wider border",
        sizes[size],
        className,
      )}
      style={{
        color,
        borderColor: `color-mix(in oklab, ${color} 40%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${color} 12%, transparent)`,
      }}
    >
      <Icon size={iconSize} strokeWidth={2.5} />
      {label}
      {tier ? ` ${tier}` : ""}
    </span>
  );
}
