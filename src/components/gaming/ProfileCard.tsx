import { Link } from "@tanstack/react-router";
import { RankBadge } from "./RankBadge";
import { MapPin, Users, BadgeCheck } from "lucide-react";
import type { PlayerProfile } from "@/types";

export function ProfileCard({ player }: { player: PlayerProfile }) {
  return (
    <Link
      to="/profile/$username"
      params={{ username: player.username }}
      className="group block bg-gradient-surface border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-gold transition-all"
    >
      <div className="flex items-start gap-4">
        <img
          src={player.avatar}
          alt={player.displayName}
          className="w-16 h-16 rounded-full border-2 border-primary/40 object-cover"
          loading="lazy"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {player.displayName}
            </h3>
            {player.verified && <BadgeCheck size={16} className="text-primary shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground truncate">@{player.username}</p>
          <div className="mt-2"><RankBadge rank={player.rank} tier={player.tier} size="sm" /></div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{player.bio}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {player.roles.map((r) => (
          <span key={r} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-accent/40 text-accent-foreground border border-border">
            {r}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin size={12} />{player.location}</span>
        <span className="inline-flex items-center gap-1"><Users size={12} />{player.followers.toLocaleString()}</span>
      </div>
    </Link>
  );
}
