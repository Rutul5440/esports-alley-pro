import { CalendarDays, ShieldCheck, Trophy } from "lucide-react";
import type { ScrimEvent } from "@/types";
import { gameName } from "@/lib/mock-data";
import { BadgeChip } from "./BadgeChip";

export function ScrimCard({ event, onRegister }: { event: ScrimEvent; onRegister?: () => void }) {
  const levelName = typeof event.level === "string" ? event.level : event.level?.name;
  const registered = event.registered ?? event.registrations?.length ?? 0;
  const capacity = event.maxTeams || event.capacity || 1;
  const pct = Math.min(100, Math.round((registered / capacity) * 100));
  const organizer =
    typeof event.organizer === "string" ? event.organizer : event.organizer?.username || "Grid Lock";
  const date = event.date || event.scheduledAt || event.startsAt || "";

  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <BadgeChip label={levelName || "Rookie"} />
            <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
              {event.kind === "tournament" ? "Tournament" : event.format || "Scrim"}
            </span>
          </div>
          <h2 className="mt-3 font-display text-xl font-bold">{event.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {organizer} · {gameName(event.game)}
          </p>
        </div>
        {event.kind === "tournament" ? (
          <Trophy className="text-primary" />
        ) : (
          <ShieldCheck className="text-primary" />
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays size={15} /> {formatDate(date)}
      </div>
      {event.prize && (
        <p className="mt-4 rounded-md border border-border bg-background/60 p-3 text-sm">
          {event.prize}
        </p>
      )}

      <div className="mt-5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {registered}/{capacity} registered
          </span>
          <span>{event.status}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-gradient-gold" style={{ width: `${pct}%` }} />
        </div>
      </div>
      {onRegister && (
        <button
          type="button"
          onClick={onRegister}
          className="mt-4 w-full rounded-md bg-gradient-gold px-4 py-2 text-sm font-semibold text-primary-foreground shadow-gold"
        >
          Register
        </button>
      )}
    </article>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return value || "TBA";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
