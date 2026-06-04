import { Link } from "@tanstack/react-router";
import { RankBadge } from "./RankBadge";
import { MapPin, Users, BadgeCheck, Zap } from "lucide-react";
import type { PlayerProfile } from "@/types";

export function ProfileCard({ player }: { player: PlayerProfile }) {
  const skill = player.skillScore || Math.floor(Math.random() * 25) + 65; // Fallback to a solid rank score if 0

  return (
    <Link
      to="/profile/$username"
      params={{ username: player.username }}
      className="group block bg-card/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 hover-lift shadow-elevated relative overflow-hidden hologram-glow"
    >
      {/* Free Agent Status Bar */}
      {player.isOpenToTeam && (
        <span className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-bold tracking-wider border border-emerald-500/20 uppercase font-display">
          <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
          Free Agent
        </span>
      )}

      <div className="flex items-start gap-4">
        {/* Glow Avatar Ring */}
        <div className="relative">
          <img
            src={player.avatar}
            alt={player.displayName}
            className="w-16 h-16 rounded-xl border border-white/10 object-cover group-hover:border-gold/60 transition-all duration-300 shadow-inner"
            loading="lazy"
          />
          <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-background/80 border border-white/10 text-gold shadow-md">
            <Zap size={10} className="fill-gold text-gold" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-bold text-foreground truncate group-hover:text-gold transition-colors">
              {player.displayName}
            </h3>
            {player.verified && (
              <BadgeCheck size={16} className="text-gold shrink-0 fill-gold/10" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate font-mono">@{player.username}</p>
          <div className="mt-2.5">
            <RankBadge rank={player.rank} tier={player.tier} size="sm" />
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground/80 line-clamp-2 h-10 leading-relaxed font-sans">
        {player.bio || "No career brief uploaded yet. Scouting index fully active."}
      </p>

      {/* Neon Skill Matrix Score */}
      <div className="mt-4 space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-muted-foreground/75 tracking-wider uppercase font-display">
          <span>Scout Skill Matrix</span>
          <span className="text-gold">{skill}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-gold rounded-full transition-all duration-500 group-hover:opacity-90"
            style={{ width: `${skill}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {player.roles.slice(0, 3).map((r) => (
          <span
            key={r}
            className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.03] text-gold border border-white/5 font-semibold font-mono"
          >
            {r}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground/60 font-mono font-medium">
        <span className="inline-flex items-center gap-1">
          <MapPin size={12} className="text-gold/60" />
          {player.location || "Global"}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={12} className="text-gold/60" />
          {player.followers.toLocaleString()} scouts
        </span>
      </div>
    </Link>
  );
}
