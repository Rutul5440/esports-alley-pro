import { Bookmark, Mail, UserRoundSearch } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BadgeChip } from "./BadgeChip";

export function PlayerCard({ player, onSave, onInvite }: { player: any; onSave?: () => void; onInvite?: () => void }) {
  const user = player.user || player.playerId || {};
  const username = user.username || player.username || "player";
  const displayName = player.displayName || username;
  const rank = player.stats?.rank || player.gameStats?.[0]?.rank || player.rank || "Bronze";
  const kd = player.stats?.kd ?? player.gameStats?.[0]?.kd ?? 0;
  const winRate = player.stats?.winRate ?? player.gameStats?.[0]?.winRate ?? 0;

  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <img src={user.avatar || player.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${username}`} alt="" className="h-14 w-14 rounded-full border border-border object-cover" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-lg font-bold">{displayName}</h2>
          <p className="text-sm text-muted-foreground">@{username}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <BadgeChip label={rank} icon={false} />
            {(player.roles || [player.role]).filter(Boolean).slice(0, 2).map((role: string) => (
              <span key={role} className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">{role}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Metric label="K/D" value={kd} />
        <Metric label="Win%" value={winRate} />
        <Metric label="Views" value={player.profileViews || 0} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button type="button" onClick={onSave} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-2 text-xs hover:border-primary/50">
          <Bookmark size={14} /> Save
        </button>
        <Link to="/profile/$username" params={{ username }} className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-2 text-xs hover:border-primary/50">
          <UserRoundSearch size={14} /> View
        </Link>
        <button type="button" onClick={onInvite} className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary/10 px-2 py-2 text-xs font-semibold text-primary">
          <Mail size={14} /> Invite
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border p-2">
      <div className="font-semibold">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
