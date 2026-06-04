import type { GameId } from "@/types";
import { games } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function GameFilterChips({
  value,
  onChange,
  includeAll = true,
}: {
  value: GameId | "all";
  onChange: (value: GameId | "all") => void;
  includeAll?: boolean;
}) {
  const items = includeAll ? [{ id: "all" as const, shortName: "All" }, ...games] : games;
  return (
    <div className="sticky top-16 z-20 flex gap-2 overflow-x-auto border-b border-border bg-background/90 py-3 backdrop-blur">
      {items.map((game) => {
        const active = value === game.id;
        return (
          <button
            key={game.id}
            type="button"
            onClick={() => onChange(game.id)}
            className={cn(
              "shrink-0 rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
              active
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {game.shortName}
          </button>
        );
      })}
    </div>
  );
}
